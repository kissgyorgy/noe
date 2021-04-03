import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import "./styles/styles.css";
import { Provider as AppointmentProvider } from "./contexts/appointmentContext";
import { Provider as LocationProvider } from "./contexts/locationContext";
import { Provider as SeatProvider } from "./contexts/seatContext";
import { Provider as SurveyProvider } from "./contexts/surveyContext";
import { Provider as TimeSlotProvider } from "./contexts/timeSlotContext";
import Nav from "./components/Nav";
import Start from "./screens/Start/Start";
import AddSeat from "./screens/AddSeat/AddSeat";
import EmailVerification from "./screens/EmailVerification";
import VerifyEmail from "./screens/VerifyEmail";
import PaymentMethods from "./screens/PaymentMethods/PaymentMethods";
import Registration from "./screens/Registration/Registration";
import SeatDetails from "./screens/SeatDetails/SeatDetails";
import Survey from "./screens/Survey/Survey";
import Time from "./screens/Time/Time";
import Checkout from "./screens/Checkout/Checkout";
import AppointmentSuccess from "./screens/AppointmentSuccess/AppointmentSuccess";
import PaymentStatus from "./screens/PaymentStatus/PaymentStatus";
import { TopStripe } from "./UI";
import PaymentFailed from "./screens/PaymentStatus/PaymentFailed";
import CancelAppointment from "./screens/CancelAppointment/CancelAppointment";

export const ROUTE_START = "/start";
export const ROUTE_EMAIL_VERIFICATION = "/megerosito-email";
export const ROUTE_VERIFY_EMAIL = "/email-megerosites";
export const ROUTE_REGISTRATION = "/regisztracio";
export const ROUTE_SEAT_DETAILS = "/szemelyes-adatok";
export const ROUTE_SURVEY = "/kerdoiv";
export const ROUTE_ADD_SEAT = "/uj-szemely";
export const ROUTE_TIME = "/idopont";
export const ROUTE_PAYMENT_METHODS = "/fizetesi-mod";
export const ROUTE_CHECKOUT = "/osszegzes";
export const ROUTE_APPOINTMENT_SUCCESS = "/sikeres-regisztracio";
export const ROUTE_PAYMENT_STATUS = "/fizetes-status";
export const ROUTE_PAYMENT_FAILED = "/sikertelen-fizetes";
export const ROUTE_CANCEL_APPOINTMENT = "/regisztracio-lemondas";

let DEFAULT_ROUTE = ROUTE_START;
if (process.env.NODE_ENV === "development") {
  DEFAULT_ROUTE = ROUTE_START;
}

function App() {
  const routes = [
    { path: ROUTE_START, component: Start },
    { path: ROUTE_EMAIL_VERIFICATION, component: EmailVerification },
    { path: ROUTE_VERIFY_EMAIL, component: VerifyEmail },
    { path: ROUTE_REGISTRATION, component: Registration },
    { path: ROUTE_SEAT_DETAILS, component: SeatDetails },
    { path: ROUTE_SURVEY, component: Survey },
    { path: ROUTE_ADD_SEAT, component: AddSeat },
    { path: ROUTE_TIME, component: Time },
    { path: ROUTE_PAYMENT_METHODS, component: PaymentMethods },
    { path: ROUTE_CHECKOUT, component: Checkout },
    { path: ROUTE_APPOINTMENT_SUCCESS, component: AppointmentSuccess },
    { path: ROUTE_PAYMENT_STATUS, component: PaymentStatus },
    { path: ROUTE_PAYMENT_FAILED, component: PaymentFailed },
    { path: ROUTE_CANCEL_APPOINTMENT, component: CancelAppointment },
  ];

  return (
    <div className="App">
      {process.env.NODE_ENV === "development" && <TopStripe>LOCAL</TopStripe>}
      {process.env.REACT_APP_NODE_ENV === "staging" && <TopStripe>SANDBOX</TopStripe>}
      <Router>
        <Nav routes={routes} />
        <Switch>
          <Redirect exact from="/" to={DEFAULT_ROUTE} />
          {routes.map((route) => (
            <Route path={route.path} key={route.path}>
              <route.component></route.component>
            </Route>
          ))}
        </Switch>
      </Router>
    </div>
  );
}

function WrappedApp(props) {
  return (
    <AppointmentProvider>
      <LocationProvider>
        <SeatProvider>
          <SurveyProvider>
            <TimeSlotProvider>
              <App />
            </TimeSlotProvider>
          </SurveyProvider>
        </SeatProvider>
      </LocationProvider>
    </AppointmentProvider>
  );
}

export default WrappedApp;
