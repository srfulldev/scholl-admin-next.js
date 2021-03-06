/* jshint esversion: 6 */
import React, { Component } from "react";
import update from "immutability-helper";
import Router from "next/router";
import { StickyContainer, Sticky } from "react-sticky";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { createStructuredSelector } from "reselect";
import {
  fetchStudents,
  deleteStudent,
  setStudents,
  setActiveStudent,
} from "../components/Student/index/actions";


import { createStudentApi } from "../components/Student/index/api";

import { makeSelectStudents } from "../components/Student/index/selectors";
import StudentCard from "../components/Student/components/StudentCard";
import FilterSection from "../components/Student/ListPage/Components/FilterSection";
import StudentModal from "../components/Student/components/StudentModal";
import IndividualStudentPage from "../components/Student/IndividualStudentPage";
import LocationModal from "../components/Location/components/LocationModal";

import {
  studentFirstNameAscending,
  studentFirstNameDescending,
  studentLastNameAscending,
  studentLastNameDescending,
} from "../components/utils/sortFunctions";
import { loggedIn, logIn } from "../utils/AuthService";


import {
  fetchAllLocationns,
} from '../components/Location/index/actions';

import { makeSelectLocations } from "../components/Location/index/selectors";
import { makeSelectCurrentUser } from "../components/User/index/selectors";

// eslint-disable-next-line prefer-template
const idGenerator = () =>
  `${subIdGenerator() +
  subIdGenerator()}-${subIdGenerator()}-${subIdGenerator()}-${subIdGenerator()}-${subIdGenerator()}${subIdGenerator()}${subIdGenerator()}`;
const subIdGenerator = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

class Students extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStudent: null,
      students: this.props.students,
      studentModalOpen: false,
      locationModalOpen: false,
      dropdownIsOpen: false,
      dropdownIndex: null,
      sort: "",
      filterName: "",
      location: "",
      newStudent: {
        active: false,
        studentInformation: {
          firstName: "",
          lastName: "",
        },
        contactInformation: {
          phone: "",
          addressLine: "",
          city: "",
          state: "",
          zipCode: "",
        },
        emailAddress: {
          email: "",
        },
        location: {
          locations: [],
        },
      },
      hasRequiredFields: true,
    };
  }

  componentDidMount = () => {
    if (!loggedIn()) {
      Router.push("/login");
    } else {
      const { onFetchStudents, students, locations, onFetchAllLocationns } = this.props;
      if (students.length === 0) {
        onFetchStudents();
      }
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const { onFetchAllLocationns } = this.props;
    const { locations } = nextProps;
    if (!locations && nextProps.currentUser) {
      const { currentUser: { id } } = nextProps;
      onFetchAllLocationns(id);
    }
  }

  componentDidUpdate() {
    const { students: studentState } = this.state;
    const { students } = this.props;
    if (studentState.length === 0 && students.length > 0) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ students });
    }
  }

  onOpenStudentModal = () => this.setState({ studentModalOpen: true });
  onCloseStudentModal = () => this.setState({ studentModalOpen: false });
  onOpenLocationModal = () => this.setState({ locationModalOpen: true });
  onCloseLocationModal = () => this.setState({ locationModalOpen: false });

  onSetSort = sort => this.setState({ sort });
  onSetFilteredState = filterName => this.setState({ filterName });
  onUnsetFilteredState = () => this.setState({ filterName: "" });

  onSetFilteredLocationState = location => this.setState({ location });
  onUnsetFilteredLocationState = () => this.setState({ location: "" });

  // TODO add a toas or some notification that a student has been saved
  onSaveNewStudent = async () => {
    const { newStudent: previousStudentState } = this.state;
    const { onFetchStudents } = this.props;
    const { firstName, lastName } = previousStudentState.studentInformation;
    // dispatch add student action
    if (!firstName || !lastName) return this.setState({ hasRequiredFields: false });
    const { firstName: first_name, lastName: last_name } = previousStudentState.studentInformation;
    const { email } = previousStudentState.emailAddress;
    const {
      state,
      addressLine,
      city,
      phone,
      zipCode: zip,
    } = previousStudentState.contactInformation;
    const { locations } = previousStudentState.location;
    const formattedLocations = locations.map(location => location.id);
    const studentPayload = {
      first_name,
      last_name,
      email,
      state,
      locations: formattedLocations,
      phone,
      address: `${addressLine}`,
      city,
      zip,
    };
    const { user_id: id } = await createStudentApi(studentPayload);
    const {
      studentInformation,
      contactInformation,
      emailAddress,
      location,
    } = previousStudentState;
    const newTestStudent = {
      id,
      active: false,
      studentInformation,
      contactInformation,
      emailAddress,
      location,
      stats: {
        complete: 0,
        overdue: 0,
        practice_tests: 0,
        sessions_complete: 0,
        total_sessions: 0,
      },
      tutor: "",
      testScores: {
        initialScore: "0",
        currentScore: "0",
      },
      courseContext: {
        courseStartDateOption: "secondOption",
        courseStartDate: "",
        courseEndDateOption: "secondOption",
        courseEndDate: "",
        targetTestDate: "12/12/2019",
        targetScore: "1400",
        highSchool: "Everglades High",
        graduationYear: "2018",
      },
      courseProgress: {
        startDate: "6/03/18",
        testDate: "10/14/18",
        progress: "77",
        improvement: "82",
        lessons: "73",
        instruction: "68",
        practiceTests: "47",
      },
      overdueWork: {
        lessons: "12",
        worksheets: "3",
        quizzes: "1",
        practiceTests: "5",
      },
      summary: {
        questionsAnswered: "791",
        videoWatched: "416",
        notesTaken: "52",
        totalTimeLoggedIn: "220",
        lastLogIn: "3:12",
        loginTimeCode: "pm",
        onTimePercentage: "77",
      },
      testScores: {
        initialScore: "1040",
        currentScore: "1300",
        compositeScore: {
          reading: "83",
          writing: "31",
          math: "105",
          composite: "218",
        },
        subjectScores: {
          reading: "58",
          writing: "44",
          math: "91",
          composite: "195",
        },
      },
      strengthsAndWeaknesses: {
        reading: {
          correctAnswers: "32",
          totalAnswers: "52",
        },
        writing: {
          correctAnswers: "35",
          totalAnswers: "52",
        },
        math: {
          correctAnswers: "37",
          totalAnswers: "52",
        },
      },
    };
    const newStudent = update(previousStudentState, {
      $set: {
        active: false,
        studentInformation: {
          firstName: "",
          lastName: "",
        },
        contactInformation: {
          phone: "",
          addressLine: "",
          city: "",
          state: "",
          zipCode: "",
        },
        emailAddress: {
          email: "",
        },
        location: {
          locations: [],
        },


      },
    });
    this.setState({ newStudent });
    const updatedStudents = update(this.state.students, {
      $push: [newTestStudent],
    });
    this.setState({ students: updatedStudents });
    // const { onSetStudents } = this.props;
    // onSetStudents(updatedStudents);
    this.onCloseStudentModal();
  };

  onDeleteNewStudent = () => {
    const { newStudent: previousStudentState } = this.state;
    const newStudent = update(previousStudentState, {
      $set: {
        active: false,
        studentInformation: {
          firstName: "",
          lastName: "",
        },
        contactInformation: {
          phone: "",
          addressLine: "",
          city: "",
          state: "",
          zipCode: "",
        },
        emailAddress: {
          email: "",
        },
        location: {
          locations: [],
        },
      },
    });
    this.setState({ newStudent });
  };

  onRemoveLocation = index => {
    const { newStudent: previousStudentState } = this.state;
    const {
      location: { locations },
    } = this.state.newStudent;
    const newLocationsArray = this.arrayItemRemover(locations, locations[index]);
    const newStudent = update(previousStudentState, {
      location: { $set: { locations: newLocationsArray } },
    });
    this.setState({ newStudent });
  };

  onFilterByName = () => {
    const { students, nameFilter } = this.state;
    return students.reduce((finalArr, currentStudent) => {
      const {
        studentInformation: { firstName, lastName },
      } = currentStudent;
      const studentString = `${firstName}${lastName}`.replace(/\s/g, "").toLowerCase();
      if (studentString.indexOf(nameFilter) !== -1 && finalArr.indexOf(currentStudent) === -1) {
        finalArr.push(currentStudent);
      }
      return finalArr;
    }, []);
  };

  onHandleStudentCard = async index => {
    const { students } = this.state;
    const { onSetActiveStudent } = this.props;
    onSetActiveStudent(students[index]);
    this.setState({ selectedStudent: students[index] });
  };

  onRedirectToStudentPage = event => {
    event.preventDefault();
    this.setState({ selectedStudent: null });
  };

  onDeleteStudent = index => {
    const { onDeleteStudent } = this.props;
    const { students } = this.state;
    // Dispatch deleteStudent
    // eslint-disable-next-line camelcase
    const student_id = students[index].id;
    onDeleteStudent(student_id);
    const newStudentArray = this.arrayItemRemover(students, students[index]);
    this.setState({ students: newStudentArray });
    this.onCloseDropdown();
  };

  onCloneStudent = index => {
    const { students } = this.state;
    const newStudent = update(students[index], {
      id: { $set: idGenerator() },
    });
    this.setState(prevState => {
      prevState.students.push(newStudent);
      return { students: prevState.students };
    });
  };

  handleChange = (event, name, section) => {
    const { newStudent: previousStudentState } = this.state;
    const value = event.target ? event.target.value : event;
    const updatedStudent = update(previousStudentState, {
      [section]: { $merge: { [name]: value } },
    });
    this.setState({ newStudent: updatedStudent });
  };

  onSaveStudentChanges = updatedStudent => {
    const { students: originalStudents } = this.state;
    const {
      active,
      studentInformation,
      contactInformation,
      emailAddress,
      location,
    } = updatedStudent;
    const studentToUpdate = originalStudents.filter(student => student.id === updatedStudent.id)[0];
    const updatedStudentIndex = originalStudents.indexOf(studentToUpdate);
    const students = update(originalStudents, {
      [updatedStudentIndex]: {
        $merge: { active, studentInformation, contactInformation, emailAddress, location },
      },
    });
    this.setState({ students });
    const { onSetStudents } = this.props;
    onSetStudents(students);
  };

  onSetDropdown = dropdownIndex => this.setState({ dropdownIsOpen: true, dropdownIndex });
  onCloseDropdown = () => this.setState({ dropdownIsOpen: false, dropdownIndex: null });

  // eslint-disable-next-line consistent-return
  onSortStudents = students => {
    const { sort } = this.state;
    switch (sort) {
      case "lastNameDescending":
        return students.sort(studentLastNameDescending);
      case "lastNameAscending":
        return students.sort(studentLastNameAscending);
      case "firstNameDescending":
        return students.sort(studentFirstNameDescending);
      case "firstNameAscending":
        return students.sort(studentFirstNameAscending);
      default:
        break;
    }
  };

  getMappableStudents = () => {
    const { sort, students } = this.state;
    const mappableStudents = students;
    if (sort) {
      return this.onSortStudents(mappableStudents);
    }
    return mappableStudents;
  };

  arrayItemRemover = (array, value) => array.filter(student => student !== value);

  mapStudents = () =>
    this.getMappableStudents().map((student, index) => (
      <StudentCard
        student={student}
        index={index}
        id={student.id}
        key={student.id}
        dropdownIsOpen={this.state.dropdownIsOpen}
        dropdownIndex={this.state.dropdownIndex}
        onSetDropdown={this.onSetDropdown}
        onCloseDropdown={this.onCloseDropdown}
        onHandleStudentCard={() => this.onHandleStudentCard(index)}
        onDeleteStudent={() => this.onDeleteStudent(index)}
        onCloneStudent={() => this.onCloneStudent(index, student.id)}
        onSaveStudentChanges={this.onSaveStudentChanges}
      />
    ));

  updateStudentStatus = () => this.setState({ selectedStudent: { ...this.state.selectedStudent, active: true } })
  render() {
    const { studentModalOpen, selectedStudent } = this.state;
    return (
      <main id="main" role="main">
        <div className="main-holder grey lighten-5">
          <StickyContainer>
            {!selectedStudent && (
              <React.Fragment>
                <Sticky>
                  {({ style }) => (
                    <div className="title-row card-panel" style={{ ...style, zIndex: 1999 }}>
                      <div className="mobile-header">
                        <a href="#" data-target="slide-out" className="sidenav-trigger">
                          <i className="material-icons">menu</i>
                        </a>
                      </div>
                      <h2 className="h1 white-text">
                        <span className="heading-holder">
                          <i className="icon-student"></i>
                          <span className="heading-block">Students</span>
                        </span>
                      </h2>
                    </div>
                  )}
                </Sticky>
                <FilterSection
                  onSetSort={this.onSetSort}
                  onSetFilteredState={this.onSetFilteredState}
                  onUnsetFilteredState={this.onUnsetFilteredState}
                  onSetFilteredLocationState={this.onSetFilteredLocationState}
                  onUnsetFilteredLocationState={this.onUnsetFilteredLocationState}
                  handleFilterClick={this.handleFilterClick}
                  onFilterByName={this.onFilterByName}
                />
                <div className="content-section">
                  <div className="row d-flex-content">{this.mapStudents()}</div>
                </div>
                <a
                  href="#"
                  className="waves-effect waves-teal btn add-btn modal-trigger"
                  onClick={this.onOpenStudentModal}
                >
                  <i className="material-icons">add</i>New Student
                </a>
                <StudentModal
                  open={studentModalOpen}
                  onClose={this.onCloseStudentModal}
                  handleChange={this.handleChange}
                  state={this.state.newStudent}
                  onSave={this.onSaveNewStudent}
                  onOpenLocationModal={this.onOpenLocationModal}
                  onRemoveLocation={this.onRemoveLocation}
                  onDeleteNewStudent={this.onDeleteNewStudent}
                  hasRequiredFields={this.state.hasRequiredFields}
                />
                <LocationModal
                  open={this.state.locationModalOpen}
                  onClose={this.onCloseLocationModal}
                  handleLocationsChange={selectedLocations =>
                    this.handleChange(selectedLocations, "locations", "location")
                  }
                />
              </React.Fragment>
            )}
            {selectedStudent && (
              <IndividualStudentPage
                student={selectedStudent}
                onRedirectToStudentPage={this.onRedirectToStudentPage}
                updateStudentStatus={this.updateStudentStatus}
              />
            )}
          </StickyContainer>
        </div>
      </main>
    );
  }
}

Students.propTypes = {
  students: PropTypes.array.isRequired,
  onFetchStudents: PropTypes.func.isRequired,
  onCreateStudent: PropTypes.func.isRequired,
  onDeleteStudent: PropTypes.func.isRequired,
  onSetStudents: PropTypes.func.isRequired,
  locations: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
  students: makeSelectStudents(),
  locations: makeSelectLocations(),
  currentUser: makeSelectCurrentUser(),
});

const mapDispatchToProps = dispatch => ({
  onDeleteStudent: id => dispatch(deleteStudent(id)),
  onFetchStudents: () => dispatch(fetchStudents()),
  onSetStudents: students => dispatch(setStudents(students)),
  onSetActiveStudent: student => dispatch(setActiveStudent(student)),
  onFetchAllLocationns: (user_id) => dispatch(fetchAllLocationns(user_id)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Students);
