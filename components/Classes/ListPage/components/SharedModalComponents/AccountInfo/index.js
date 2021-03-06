import React from 'react';
import PropTypes from 'prop-types';

const AccountInfo = ({ state: { firstName, lastName, email }, handleDetailsChange }) => (
  <div className="card-block">
    <h3>Account Info</h3>
    <div className="card-main card">
      <div className="card-content">
        <div className="row mb-0">
          <div className="input-field col s12">
            <input
              type="text"
              id="first-name"
              name="firstName"
              value={firstName}
              onChange={(event) => handleDetailsChange(event, 'firstName', 'accountInfo')}
            />
            <label className={firstName.length ? 'label active' : 'label'} htmlFor="first-name">First Name*</label>
          </div>
        </div>
        <div className="row mb-0">
          <div className="input-field col s12">
            <input
              type="text"
              id="last-name"
              name="lastName"
              value={lastName}
              onChange={(event) => handleDetailsChange(event, 'lastName', 'accountInfo')}
            />
            <label className={lastName.length ? 'label active' : 'label'} htmlFor="last-name">Last Name*</label>
          </div>
        </div>
        <div className="row mb-0">
          <div className="input-field col s12">
            <input
              type="text"
              id="account_email_edit"
              name="email"
              value={email}
              onChange={(event) => handleDetailsChange(event, 'email', 'accountInfo')}
            />
            <label className={email.length ? 'label active' : 'label'} htmlFor="account_email_edit">Email Address*</label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

AccountInfo.propTypes = {
  state: PropTypes.object.isRequired,
  handleDetailsChange: PropTypes.func.isRequired,
};

export default AccountInfo;
