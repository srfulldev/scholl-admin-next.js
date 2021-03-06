import React from "react";
import PropTypes from "prop-types";
import update from 'immutability-helper';
import Portal from "../../../../Portal";
import ClickOffComponentWrapper from '../../../../ClickOffComponentWrapper';

import AccountInfo from '../SharedModalComponents/AccountInfo';
import ContactInfo from '../SharedModalComponents/ContactInfo';
import Locations from '../SharedModalComponents/Locations';

import { nestedEditFieldValidation } from '../../../../utils/fieldValidation';

class ClassDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteLocationModalOpen: false,
      newLocationModalOpen: false,
      editLocationModalOpen: false,
      pendingLocationDelete: {},
      activeLocation: {},
      dropdownIsOpen: false,
      dropdownIndex: null,
      originalClassRoom: {
        summary: {
          amount_students: '',
          start_date: '',
          end_date: '',
          improvement: 0,
          coursework_assigned: 0,
          coursework_completed: 0,
          problems_flagged_review: 0,
          average_score: 0,
          achieved_target_score: 0,
          average_practice_tests_completed: 0,
          instruction: 0,
        },
        accountInfo: {
          firstName: '',
          lastName: '',
          email: '',
        },
        contactInfo: {
          phone: '',
          streetAddress: '',
          city: '',
          state: '',
          zip: '',
        },
        locations: [],
      },
      updatedClassRoom: {
        summary: {
          amount_students: '',
          start_date: '',
          end_date: '',
          improvement: 0,
          coursework_assigned: 0,
          coursework_completed: 0,
          problems_flagged_review: 0,
          average_score: 0,
          achieved_target_score: 0,
          average_practice_tests_completed: 0,
          instruction: 0,
        },
        accountInfo: {
          firstName: '',
          lastName: '',
          email: '',
        },
        contactInfo: {
          phone: '',
          streetAddress: '',
          city: '',
          state: '',
          zip: '',
        },
        locations: [],
      },
      validation: {
        accountInfo: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    };
  }

  componentDidMount() {
    const { classroom: { id, basicInfo, accountInfo, contactInfo, locations, summary } = {} } = this.props;
    const updatedClassRoom = { id, basicInfo, accountInfo, contactInfo, locations, summary };
    const { originalClassRoom: originalClassRoomState } = this.state;
    const originalClassRoom = update(originalClassRoomState, { $merge: updatedClassRoom });
    this.setState({ originalClassRoom, updatedClassRoom }); // eslint-disable-line
  }

  // This resets the component state to reflect the details of the next classroom the user clicks on
  componentWillReceiveProps = (nextProps) => {
    if ((!this.state.originalClassRoom || nextProps.classroom.id !== this.state.originalClassRoom.id)) {
      const { classroom: { id, basicInfo, accountInfo, contactInfo, locations, summary } = {} } = nextProps;
      const updatedClassRoom = { id, basicInfo, accountInfo, contactInfo, locations, summary };
      const { originalClassRoom: originalClassRoomState } = this.state;
      const originalClassRoom = update(originalClassRoomState, {
        $merge: nextProps.classroom,
      });
      this.setState({ originalClassRoom, updatedClassRoom });
    }
  }

  // We pull the value based on the field type then merge that updated key/value pair with the last version of component state
  handleDetailsChange = (event, name, section) => {
    const value = event.target ? event.target.value : event;
    const updatedClassRoom = update(this.state.updatedClassRoom, {
      [section]: { $merge: { [name]: value } },
    });
    this.setState({ updatedClassRoom });
  }

  initialClassRoomMount = () => this.state.originalClassRoom.id !== this.props.classroom.id;

  renderModalHeader = () => {
    const { classroom: { accountInfo: { lastName: initialLastName, firstName: initialFIrstName, email: initialEmail } } } = this.props;
    const { updatedClassRoom: { accountInfo: { lastName: updatedLastName, firstName: updatedFirstName, email: updatedEmail } } } = this.state;
    let lastName;
    let firstName;
    let email;
    if (this.initialClassRoomMount()) {
      lastName = initialLastName;
      firstName = initialFIrstName;
      email = initialEmail;
    } else {
      lastName = updatedLastName;
      firstName = updatedFirstName;
      email = updatedEmail;
    }
    return (
      <React.Fragment>
        <h4 className="h3">{lastName}, {firstName}</h4>
        <a href={`mailto:${email}`}>{email}</a>
      </React.Fragment>
    );
  }

  // This function is passed into nestedEditFieldValidation, it takes the result of the validation check and a callback function
  // The updated component validation state is set and then the callback is dispatched - in this case, the callback handles the toast warning at the container level
  onSetValidation = (validation, cb) => this.setState({ validation }, cb);

  // If all the fields are valid, we construct a post body and call onSaveNewLocation passed down from the container level
  // eslint-disable-next-line consistent-return
  onSubmit = async (event) => {
    event.preventDefault();
    const { updatedClassRoom: { id, basicInfo, accountInfo, contactInfo, locations, summary } } = this.state;
    const { onSaveLocationError, onSaveClassChanges, onClose } = this.props;
    // NOTE: Swap out what instance of valid is active if you want to test saving a new location without worrying about validation
    // const valid = true;
    const valid = await nestedEditFieldValidation(this.state, this.state.updatedClassRoom, this.onSetValidation, (validation) => console.warn('validation', validation));
    if (!valid) {
      console.warn('not valid');
      return onSaveLocationError();
    }
    const postBody = { id, basicInfo, accountInfo, contactInfo, locations, summary };
    onSaveClassChanges(postBody);
    onClose();
  }

  onCancelChanges = () => {
    const { onClose } = this.props;
    const { originalClassRoom } = this.state;
    this.setState({ updatedClassRoom: originalClassRoom }, onClose());
  }

  render() {
    const { open, onDeleteClass, deleteModalOpen, index } = this.props;
    const { dropdownIsOpen, dropdownIndex, activeLocation, deleteLocationModalOpen, pendingLocationDelete, newLocationModalOpen, editLocationModalOpen,
      updatedClassRoom: { accountInfo: updatedAccountInfo, contactInfo: updatedContactInfo, locations: updatedLocations },
    } = this.state;
    return (
      <Portal selector="#modal">
        {open && (
          <div className="overlay">
            <ClickOffComponentWrapper
              onOuterClick={this.onCancelChanges}
              nestedModals={deleteModalOpen || deleteLocationModalOpen || editLocationModalOpen || newLocationModalOpen}
            >
              <div
                id="modal_user_edit"
                className="modal modal-custom modal-custom-large modal-gray"
              >
                <div className="card-modal card-main card grey lighten-3">
                  <div
                    className="owner-box card-panel card-panel-title"
                    style={{ backgroundColor: "#31837a", color: "#fff" }}
                  >
                    <div className="card-panel-row row">
                      <div className="col s9">
                        <div className="user-block">
                          <div
                            className="user-circle"
                            style={{
                              backgroundColor: "#0085ce",
                              color: "#fff",
                            }}
                          >
                            <img src="./static/images/img-owner01.jpg" alt="" />
                          </div>
                          <div className="user-text" style={{ color: "#fff" }}>
                            {this.renderModalHeader()}
                          </div>
                        </div>
                      </div>
                      <div className="col" style={{ textAlign: "right" }}>
                        <span className="block-icon">
                          <i className="icon-owner"></i>
                          <span className="text-icon">Owner</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <div className="row mb-0">
                        <div className="col s12 l6">
                          <AccountInfo
                            state={this.initialClassRoomMount() ? accountInfo : updatedAccountInfo}
                            handleDetailsChange={this.handleDetailsChange}
                          />
                          <ContactInfo
                            state={
                              this.initialClassRoomMount()
                                ? contactInfo
                                : updatedContactInfo
                            }
                            handleDetailsChange={this.handleDetailsChange}
                          />
                        </div>
                        <div className="col s12 l6">
                          <Locations
                            state={this.initialClassRoomMount() ? locations : updatedLocations}
                            handleDetailsChange={this.handleDetailsChange}
                            dropdownIsOpen={dropdownIsOpen}
                            dropdownIndex={dropdownIndex}
                            activeLocation={activeLocation}
                            deleteLocationModalOpen={deleteLocationModalOpen}
                            pendingLocationDelete={pendingLocationDelete}
                            newLocationModalOpen={newLocationModalOpen}
                            editLocationModalOpen={editLocationModalOpen}
                            onSetDropdown={this.onSetDropdown}
                            onCloseDropdown={this.onCloseDropdown}
                            onOpenNewLocationModal={this.onOpenNewLocationModal}
                            onOpenEditLocationModal={this.onOpenEditLocationModal}
                            onCloseNewLocationModal={this.onCloseNewLocationModal}
                            onCloseEditLocationModal={this.onCloseEditLocationModal}
                            onOpenDeleteLocationModal={this.onOpenDeleteLocationModal}
                            onCloseDeleteLocationModal={this.onCloseDeleteLocationModal}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <a
                        href="#"
                        onClick={() => onDeleteClass(index)}
                        className="waves-effect waves-teal btn-flat pink-text text-darken-1"
                      >
                        Delete
                      </a>
                      <a
                        href="#"
                        onClick={this.onCancelChanges}
                        className="modal-close waves-effect waves-teal btn-flat grey-text text-darken-1"
                      >
                        Cancel
                      </a>
                      <a href="#" onClick={this.onSubmit} className="btn">
                        Save
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </ClickOffComponentWrapper>
          </div>
        )}
        <style jsx>
          {`
              .overlay {
                position: fixed;
                background-color: rgba(0, 0, 0, 0.7);
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 1999;
              }
              .card-modal {
                margin: 0;
                border-radius: 6px;
              }
              .modal {
                display: block;
                background-color: white;
                position: absolute;
                top: 10%;
                right: 10%;
                left: 10%;
                box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2);
              }
              .modal-custom {
                opacity: 1;
                visibility: visible;
              }
              .modal-footer {
                background-color: white;
              }
            `}
        </style>
      </Portal>
    );
  }
}

ClassDetailModal.propTypes = {
  index: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  deleteModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  classroom: PropTypes.object.isRequired,
  onSaveClassChanges: PropTypes.func.isRequired,
  onDeleteClass: PropTypes.func.isRequired,
};

export default ClassDetailModal;
