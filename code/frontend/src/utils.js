import React from "react";
import moment from "moment";

export const MAX_SEATS_PER_APPOINTMENT = 5;

export function handleResponse({ response, setError, history, redirectRoute }) {
  if (response.error) {
    if (response.status !== 500 && response.errors) {
      setErrors(setError, response.errors);
    } else {
      alert("Váratlan hiba történt.");
    }
  } else {
    if (!!history) {
      history.push(redirectRoute);
    }
  }
}

export function setErrors(setError, errors) {
  Object.keys(errors).map((fieldName) => setError(fieldName, "", errors[fieldName]));
}

export function getQueryParamsFromObject(params) {
  if (!params) {
    return "";
  }

  const queryString = Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");

  return queryString === "" ? "" : `?${queryString}`;
}

export function getResourceUuidFromUrl(url) {
  if (!url) {
    return null;
  }
  const parts = url.split("/");
  const uuid =
    parts[parts.length - 1] === ""
      ? parts[parts.length - 2] // due to trailing slash, last `part` is ""
      : parts[parts.length - 1];
  return uuid;
}

export function isMaxSeatCountReached(seatCount) {
  return seatCount >= MAX_SEATS_PER_APPOINTMENT;
}

export function formatAppointmentDate(selectedTimeSlot) {
  if (!selectedTimeSlot) {
    return "";
  }

  const start = moment(selectedTimeSlot.start);
  const end = moment(selectedTimeSlot.end);
  return (
    <>
      {`${start.format("YYYY. MM. DD.")}`}
      <br />
      {`${start.format("HH:mm")}-${end.format("HH:mm")}`}
    </>
  );
}
