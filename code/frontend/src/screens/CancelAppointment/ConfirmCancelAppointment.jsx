import React, { useState } from "react";
import { View, Caption, Text, Image, NextButton, Button, DataRow } from "../../UI";
import { formatAppointmentDate } from "../../utils";

export default function ConfirmCancelAppointment({ locationName, licencePlate, selectedTimeSlot, personCount }) {
  const [cancelled, setCancelled] = useState(false);

  const onClickCancelAppointment = () => {
    setCancelled(true);
    // URLs are stored in context/consts
    // use locationContext.js, timeSlotContext.js to add new fetch-one functions
    // Don't really care about what the dispatch is, how it is put there
    // Use this format, for requesting and error handling:
    // try {
    //   response = await axios.get(consts.PAYMENT_STATUS_URL);
    // } catch (error) {
    //   return { error: true, errors: error?.response?.data || [] };
    // }
    // axios.post("delete")
  };

  const onClickDontCancel = () => {
    window.location.href = "https://www.tesztallomas.hu";
  };

  let bottomPart;
  if (cancelled) {
    bottomPart = "Regisztrációját töröltük rendszerünkből minden hozzá tartozó adattal együtt.";
  } else {
    bottomPart = (
      <>
        <Button toCenter onClick={onClickCancelAppointment}>
          Lemondás
        </Button>
        <Button toCenter inverse onClick={onClickDontCancel}>
          Vissza a főoldalra
        </Button>
      </>
    );
  }

  return (
    <View>
      <Caption center>Regisztráció lemondása</Caption>
      <DataRow>
        <Text light>Helyszín</Text>
        <Text dark>{locationName}</Text>
      </DataRow>
      <DataRow>
        <Text light>Regisztrált jármű</Text>
        <Text dark>{licencePlate}</Text>
      </DataRow>
      <DataRow>
        <Text light>Személyek száma</Text>
        <Text dark right>
          {personCount}
        </Text>
      </DataRow>
      <DataRow>
        <Text light>Mintavétel időpontja</Text>
        <Text dark right>
          {formatAppointmentDate(selectedTimeSlot)}
        </Text>
      </DataRow>
      {bottomPart}
    </View>
  );
}
