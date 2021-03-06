/* eslint-disable camelcase */
const API_URL = process.env.API_URL;
import { getToken } from '../../../utils/AuthService';

export const fetchInstructorsApi = () =>
  fetch(`${API_URL}/api/instructors`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then(res => res.json())
    .then(({ data }) => {
      const { instructors = [] } = data;
      const formattedInstructors = instructors.reduce((finalArry, currentInstructor) => {
        const {
          id,
          first_name,
          last_name,
          email,
        } = currentInstructor;
        const newInstructor = {
          id,
          accountInfo: {
            lastName: last_name,
            firstName: first_name,
            email,
          },
          contactInfo: {
            phone: "1234567890",
            streetAddress: "1234 Test Road",
            city: "Austin",
            state: "TX",
            zip: "78751",
          },
          basicInfo: {
            activeStudents: 15,
            pastStudents: 24,
            unactivatedStudents: 29,
            averageImprovement: 185,
            averageInitialScore: 1037,
            averageFinalScore: 1218,
            studentsAchievingTargetScore: 12,
          },
        };
        finalArry.push(newInstructor);
        return finalArry;
      }, []);
      return { formattedInstructors };
    })
    .catch(err => err);

export const createNewInstructorApi = insturctor =>
  fetch(`${API_URL}/api/commands/create-instructor`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(insturctor),
  })
    .then(res => res.json())
    .catch(err => err);

export const updateInstructorFirstNameApi = body =>
  fetch(`${API_URL}/api/commands/update-instructors-first-name`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => err);

export const updateInstructorLastNameApi = body =>
  fetch(`${API_URL}/api/commands/update-instructors-last-name`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => err);

export const updateInstructorEmailApi = body =>
  fetch(`${API_URL}/api/commands/update-instructors-email`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => err);

export const updateInstructorStateApi = body =>
  fetch(`${API_URL}/api/commands/update-instructors-state`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => err);

export const updateInstructorCityApi = body =>
  fetch(`${API_URL}/api/commands/update-instructors-city`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => err);

export const updateInstructorZipApi = body =>
  fetch(`${API_URL}/api/commands/update-instructors-zip`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => err);

export const updateInstructorAddressApi = body =>
  fetch(`${API_URL}/api/commands/update-instructors-address`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => err);

export const updateInstructorPhoneApi = body =>
  fetch(`${API_URL}/api/commands/update-instructors-phone`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => err);

export const addInstructorToLocationApi = body =>
  fetch(`${API_URL}/api/commands/add-instructor-to-location`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => err);

export const searchInstructorsApi = filters => {
  const queryString = `search=${filters.name}&location=${filters.location}`;
  return fetch(`${API_URL}/api/instructors?${queryString}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then(res => res.json())
    .then(({ data }) => {
      const { instructors = [] } = data;
      const formattedInstructors = instructors.reduce((finalArry, currentInstructor) => {
        const {
          id,
          first_name,
          last_name,
          email,
        } = currentInstructor;
        const newInstructor = {
          id,
          accountInfo: {
            lastName: last_name,
            firstName: first_name,
            email,
          },
          contactInfo: {
            phone: "1234567890",
            streetAddress: "1234 Test Road",
            city: "Austin",
            state: "TX",
            zip: "78751",
          },
          basicInfo: {
            activeStudents: 15,
            pastStudents: 24,
            unactivatedStudents: 29,
            averageImprovement: 185,
            averageInitialScore: 1037,
            averageFinalScore: 1218,
            studentsAchievingTargetScore: 12,
          },
        };
        finalArry.push(newInstructor);
        return finalArry;
      }, []);
      return formattedInstructors;
    })
    .catch(err => err);
};
export default [
  createNewInstructorApi,
  fetchInstructorsApi,
  searchInstructorsApi,
  updateInstructorFirstNameApi,
  updateInstructorLastNameApi,
  updateInstructorEmailApi,
  updateInstructorStateApi,
  updateInstructorCityApi,
  updateInstructorZipApi,
  updateInstructorAddressApi,
  updateInstructorPhoneApi,
  addInstructorToLocationApi,
];
