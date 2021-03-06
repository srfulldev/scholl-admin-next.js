/* eslint-disable camelcase */
/* eslint-disable jsx-control-statements/jsx-jcs-no-undef */
const API_URL = process.env.API_URL;
import { getToken } from "../../../utils/AuthService";

export const fetchAllLocationsApi = (user_id) =>
  fetch(`${API_URL}/api/users/${user_id}/locations`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then(res => res.json())
    .then(({ data }) => data);
