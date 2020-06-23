import os
import datetime as dt
from django.utils.translation import gettext as _
from django.apps import apps as django_apps
from rest_framework.response import Response
from online_payments.billing.szamlazzhu.exceptions import SzamlazzhuError
from online_payments.payments.simple_v2 import SimplePay, SimplePayEvent
from online_payments.payments.simple_v2.exceptions import SimplePayException
from rest_framework.exceptions import ValidationError
from appointments.models import QRCode
from appointments import email
from ..prices import PaymentMethodType

MISSING = object()


class SimplePayService:
    payment_method_type = PaymentMethodType.SIMPLEPAY

    def __init__(self,):
        self._simplepay = SimplePay(
            os.environ["SIMPLEPAY_SECRET_KEY"], os.environ["SIMPLEPAY_MERCHANT"], os.environ["SIMPLEPAY_USE_LIVE"],
        )

    def handle_payment(self, payments, total_price, currency, email, callback_url):
        transaction = self._create_transaction(total_price, currency)

        # Order ref must be unique at a transaction level, appointment level is not enough.
        # When multiple transactions with the same order refs are sent to Simple,
        # Simple will find the same transaction.
        # It is even possible to put a transaction from Cancelled to Created state
        # in Simple's system, by creating and sending a start request with the same order_ref.
        order_ref = str(transaction.pk)
        try:
            res = self._simplepay.start(
                customer_email=email, order_ref=order_ref, total=total_price, callback_url=callback_url,
            )
        except SimplePayException as error:
            raise ValidationError({"error": str(error)})

        transaction.status = transaction.STATUS_WAITING_FOR_AUTHORIZATION
        transaction.external_reference_id = res.transaction_id
        transaction.save()

        for payment in payments:
            payment.simplepay_transactions.add(transaction)

        return Response({"simplepay_form_url": res.payment_url})

    def get_views(self):
        return [self.simplepay_ipn_view, self.simplepay_back_view]

    @api_view(["POST"])
    def simplepay_ipn_view(self, request):
        try:
            ipn, response = self._simplepay.process_ipn_request(request)
        except (InvalidSignature, IPNError):
            raise ValidationError({"error": _("SimplePay error")})

        transaction = m.SimplePayTransaction.objects.get(external_reference_id=ipn.transaction_id)
        if ipn.status == "FINISHED":
            self._complete_transaction(transaction, ipn.finish_date)

        return Response(response["body"], headers=response["headers"])

    @api_view(["GET"])
    def simplepay_back_view(self, request):
        """docs: PaymentService v2 - 3.11 back url"""

        expected_signature = request.GET["s"]
        r_params_json = base64.b64decode(request.GET["r"].encode())
        self._simplepay.validate_signature(expected_signature, r_params_json.decode())

        r_params = json.loads(r_params_json)
        event = SimplePayEvent(r_params["e"])
        if event is SimplePayEvent.SUCCESS:
            frontend_path = ROUTE_PAYMENT_STATUS
        else:
            frontend_path = ROUTE_PAYMENT_FAILED

        frontend_full_url = urljoin(settings.FRONTEND_URL, frontend_path)

        transaction_params = {
            "simplepay_transaction_id": r_params["t"],
            "simplepay_transaction_event": event.value,
        }
        return redirect(f"{frontend_full_url}?{urlencode(transaction_params)}")

    def _complete_transaction(self, transaction, finish_date):
        """
        This happens in the context of simplepay payment for the entire appointment.
        """

        transaction.status = transaction.STATUS_COMPLETED
        transaction.save()

        # any payment and seat are ok to find the right appointment
        appointment = transaction.payments.first().seat.appointment
        appointment.is_registration_completed = True
        appointment.save()

        transaction.payments.all().update(paid_at=finish_date)

        for seat in appointment.seats.all():
            QRCode.objects.create(seat=seat)

        # Need to query seats again
        for seat in appointment.seats.all():
            if not seat.email:
                raise ValidationError({"email": "Email field is required"})
            email.send_qrcode(seat)

        try:
            billing = django_apps.get_app_config("billing")
            billing.service.send_appointment_invoice(appointment)
        except SzamlazzhuError as e:
            raise ValidationError({"error": str(e)})


# submitted_data can be one of:
# - serializer.validated_data (staff_api)
# - form.cleaned_data (PaymentInline admin)
def validate_paid_at(original_paid_at, submitted_data: dict):
    new_paid_at = submitted_data.get("paid_at", MISSING)
    if new_paid_at is MISSING:
        return

    if original_paid_at and new_paid_at != original_paid_at:
        raise ValueError(_("Paid at can not be changed"))


def handle_paid_at(original_paid_at, seat, submitted_data: dict):
    try:
        validate_paid_at(original_paid_at, submitted_data)
    except ValueError:
        return

    if original_paid_at is None and submitted_data.get("paid_at"):
        billing = django_apps.get_app_config("billing")
        billing.service.send_seat_invoice(seat)
