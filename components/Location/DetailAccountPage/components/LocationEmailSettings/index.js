import React from 'react';
import PropTypes from 'prop-types';

const LocationEmailSettings = ({ state: { automatedEmailOrigin, automatedEmailSalutation }, handleDetailsChange }) => (
  <div className="card-block">
    <h3>Location Email Settings</h3>
    <div className="card-main card">
      <div className="card-content">
        <div className="row mb-0">
          <div className="input-field col s12">
            <input
              type="text"
              id="automated-email-origin"
              name="automatedEmailOrigin"
              value={automatedEmailOrigin}
              onChange={(event) => handleDetailsChange(event, 'automatedEmailOrigin', 'locationEmailSettings')}
            />
            <label className={automatedEmailOrigin.length ? 'label active' : 'label'} htmlFor="automated-email-origin">Automated Emails Come From (email)*</label>
          </div>
        </div>
        <div className="row mb-0">
          <div className="input-field col s12">
            <textarea
              className="materialize-textarea"
              id="email_salutation_edit"
              name="automatedEmailSalutation"
              value={automatedEmailSalutation}
              onChange={(event) => handleDetailsChange(event, 'automatedEmailSalutation', 'locationEmailSettings')}
            />
            <label className={automatedEmailSalutation.length ? 'label active' : 'label'} htmlFor="email_salutation_edit">Automated Email Salutation*</label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

LocationEmailSettings.propTypes = {
  state: PropTypes.object.isRequired,
  handleDetailsChange: PropTypes.func.isRequired,
};

export default LocationEmailSettings;
