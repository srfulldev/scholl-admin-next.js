/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-array-index-key */
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import React from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import moment from "moment";
import FilterSection from "./components/FilterSection";
import FullView from "./components/FullView";
import {
  dueDateAscending,
  subjectAscending,
  subjectDescending,
  passageAscending,
  passageDescending,
  lessonNameDescending,
  lessonNameAscending,
  statusDescending,
  statusAscending,
  scoreDescending,
  scoreAscending,
  availableDateAscending,
  availableDateDescending,
  dueDate,
  flagsAscending,
  flagsDescending,
  completionDateAscending,
  completionDateDescending,
  lessonTypeAscending,
  lessonTypeDescending,
} from "../../utils/sortFunctions";
import ListView from "./components/ListView";
import LessonDetailAnswerSheet from "../LessonDetailAnswerSheet";
import AssignLessonModal from "./components/AssignLessonModal";
import { renderDropdownOptions } from './components/FullView/components/LessonCard/utils/index';
import ReadWorkBook from '../ReadWorkBook';
import Modal from "../../Modal/index";
import {
  getLessonList,
  getStudentLessonList,
  checkLesson,
  checkAllLessons,
  unCheckAllLessons,
  addCheckedLesson,
  removeCheckedLesson,
  assignLessonToStudent,
  addAllLessons,
  removeAllLessons,
  excuseStudentLateness,
  filterLessons,
  flagStudentLessonProblem,
  markAllLessonFlagsReviewed,
} from "../index/actions";
import { makeSelectGetLessonList, makeSelectCheckedLessons, makeSelectActiveStudentToken, makeSelectGetStudentLessonList, makeSelectActiveLesson, makeSelectOpenActivePage, makeSelectSubjects } from "../index/selectors";
import { createStructuredSelector } from "reselect";
import AssignDatesModal from "./components/AssignDatesModal";
import { setOpenActivePage, setIsVisibleTopBar } from "../index/actions";
import { fetchStudentLessonSectionApi } from "../index/api";
import { mergeArrays } from './utils/mergeArrays';

// TODO: compare updatedlessons to lessons and update lesson list
class DetailLessonList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: true,
      lessons: [],
      modalOpen: false,
      currentView: "full",
      active: "full",
      subjectFilters: [],
      scoreStatusFilters: [],
      flagFilters: [],
      dueDateFilters: [],
      sort: "",
      nameFilter: "",
      unitFilter: "",
      updatedLessons: [],
      selectAll: false,
      dropdownIsOpen: false,
      checkedCardIds: [],
      isConfirmModalOpen: false,
      prevAssignedLessons: [],
      lessonsToAssign: {},
      prevFilters: {
        nameFilter: '',
        unitFilter: '',
      },
      confirmationModalMessage: '',
    };
  }

  componentDidMount() {
    const { id } = this.props.user;
    const { studentToken, lessonList } = this.props;
    const postBody = {
      id,
      studentToken,
    };
    if (lessonList && lessonList.length === 0) {
      this.props.dispathGetLessonList();
    }
    this.props.dispathGetStudentLessonList(postBody);
  }

  componentWillReceiveProps = (nextProps) => {
    const { activeShowPage, user: { id }, dispathGetStudentLessonList } = this.props;
    if (this.state.lessons.length === 0) {
      this.setState({
        lessons: nextProps.lessonList,
      });
    }
    if (activeShowPage !== "" && nextProps.activeShowPage === "") {
      dispathGetStudentLessonList({ id });
    }
  };

  /**
   * @param checked {bool}
   */
  onCheckAllClicked = async (checked) => {
    const selectedLessonIds = this.getMappableLessons().map(lesson => lesson.id);
    if (!checked) {
      await this.props.dispatchCheckAllLesson(selectedLessonIds);
      await this.props.dispatchAddAllLessons(this.getMappableLessons());
      this.setState({ selectAll: !checked });
    } else {
      await this.props.dispatchUnCheckAllLesson(selectedLessonIds);
      await this.props.dispatchRemoveAllLessons(this.getMappableLessons());
      this.setState({ selectAll: false });
    }
    this.setCheckedCardIds();
  };

  /**
   * @param lessonId {string}
   * @param uniqueId {string}
   */
  onAddCheckedLesson = async (lessonId, uniqueId) => {
    await this.props.dispatchAddCheckedLesson(lessonId);
    await this.props.dispathCheckLesson(uniqueId);
    this.setCheckedCardIds();
    if (!this.state.selectAll) {
      this.setState({
        selectAll: true,
      });
    }
  };

  /**
   * @param lessonId {string}
   * @param uniqueId {string}
   */
  onRemoveCheckedLesson = async (lessonId, uniqueId) => {
    await this.props.dispatchRemoveCheckedLesson(lessonId);
    await this.props.dispathCheckLesson(uniqueId);
    this.setCheckedCardIds();
    if (this.props.checkedLessons.length === 0) {
      this.setState({
        selectAll: false,
      });
    }
  };

  // This updates the selected ASSIGNED student lessons in local state
  setCheckedCardIds = () => {
    this.setState({
      checkedCardIds: this.props.lessonList
        .filter((lesson) => lesson.selected && lesson.lesson_id)
        .map((lesson) => lesson.id),
    });
  };

  onOpenModal = () => this.setState({ modalOpen: true });
  onCloseModal = () => this.setState({ modalOpen: false });

  onOpenDropdown = () => this.setState({ dropdownIsOpen: true });
  onCloseDropdown = () => this.setState({ dropdownIsOpen: false });

  onOpenConfirmModal = () => this.setState({ isConfirmModalOpen: true });
  onCloseConfirmModal = () => this.setState({ isConfirmModalOpen: false });

  onClearFilters = () =>
    this.setState({
      subjectFilters: [],
      completeFilters: [],
      flagFilters: [],
      dueDateFilters: [],
      unitFilter: "",
      nameFilter: "",
    });
  onSetSort = (sort) => this.setState({ sort });
  onSetFilteredState = (lesson) => this.setState({ nameFilter: lesson });
  onUnsetFilteredState = (filter) => this.setState({ [filter]: "" });
  onChangeView = (view) => this.setState({ currentView: view, active: view });

  onSetUnitFilter = (unit) => {
    this.setState({ unitFilter: unit });
  };

  // eslint-disable-next-line consistent-return
  onSortLessons = (lessons) => {
    const { sort } = this.state;
    switch (sort) {
      case "subjectAscending":
        return lessons.sort(subjectAscending);
      case "subjectDescending":
        return lessons.sort(subjectDescending);
      case "passageAscending":
        return lessons.sort(passageAscending);
      case "statusAscending":
        return lessons.sort(statusAscending);
      case "scoreAscending":
        return lessons.sort(scoreAscending);
      case "passageDescending":
        return lessons.sort(passageDescending);
      case "statusDescending":
        return lessons.sort(statusDescending);
      case "scoreDescending":
        return lessons.sort(scoreDescending);
      case "availableDateAscending":
        return lessons.sort(availableDateAscending);
      case "availableDateDescending":
        return lessons.sort(availableDateDescending);
      case "dueDateDescending":
        return lessons.sort(dueDate);
      case "dueDateAscending":
        return lessons.sort(dueDateAscending);
      case "flagsAscending":
        return lessons.sort(flagsAscending);
      case "flagsDescending":
        return lessons.sort(flagsDescending);
      case "lessonNameAscending":
        return lessons.sort(lessonNameAscending);
      case "lessonNameDescending":
        return lessons.sort(lessonNameDescending);
      case "completionDateAscending":
        return lessons.sort(completionDateAscending);
      case "completionDateDescending":
        return lessons.sort(completionDateDescending);
      case "lessonTypeAscending":
        return lessons.sort(lessonTypeAscending);
      case "lessonTypeDescending":
        return lessons.sort(lessonTypeDescending);
      case "dueDate":
        return lessons.sort(dueDateAscending);
      default:
        break;
    }
  };
  onAddUpdatedLessons = (lessons) => this.setState({ updatedLessons: lessons });

  onFilterByName = (mappableLessons) => {
    const { nameFilter } = this.state;
    return mappableLessons.reduce((finalArr, currentLesson) => {
      const { name } = currentLesson;
      const lessonString = name.replace(/\s/g, "").toLowerCase();
      if (lessonString.indexOf(nameFilter.toLowerCase().replace(/\s/g, '')) !== -1 && finalArr.indexOf(currentLesson) === -1) {
        finalArr.push(currentLesson);
      }
      return finalArr;
    }, []);
  };

  onCloneLesson = (index) => {
    const { lessons } = this.state;
    this.setState((prevState) => {
      prevState.lessons.push(lessons[index]);
      return { lessons: prevState.lessons };
    });
  };

  onDeleteLesson = (index) => {
    const { lessons } = this.state;
    const newLessonsArray = this.arrayItemRemover(lessons, lessons[index]);
    this.setState({ lessons: newLessonsArray });
  };
  // note: unassigned and incomplete are filtering opposite, but this works for some reason
  onFilterLessons = (mappableLessons) => {
    const {
      subjectFilters,
      unitFilter,
      scoreStatusFilters,
      flagFilters,
    } = this.state;
    const { subjects } = this.props;
    let lessons = [];
    if (scoreStatusFilters.length && scoreStatusFilters.indexOf("all") === -1) {
      lessons = mappableLessons.filter((lesson) =>
        (lesson.scoring && lesson.scoring.grade && scoreStatusFilters.indexOf(lesson.scoring.grade.toLowerCase()) !== -1),
      );
    }
    if (subjectFilters.length && subjectFilters.indexOf("all") === -1) {
      lessons = mappableLessons.filter((lesson) => {
        if (!lesson.subjects) {
          return subjectFilters.indexOf(subjects[lesson.subject_id]) !== -1;
        }
        return subjectFilters.indexOf(lesson.subjects.name) !== -1;
      });
    }
    if (flagFilters.length && flagFilters.indexOf("all") === -1) {
      lessons = lessons.filter((lesson) =>
        (lesson.problems && lesson.problems.filter(problem => problem.flat_status).length !== 0),
      );
    }
    if (unitFilter.length && unitFilter.indexOf("all") === -1) {
      lessons = mappableLessons.filter((lesson) => {
        if (!lesson.units) {
          return unitFilter.indexOf(lesson.unit_id) !== -1;
        }
        return unitFilter.indexOf(lesson.units.id) !== -1;
      });
    }
    return lessons;
  };

  getMappableLessons = () => {
    const {
      sort,
      unitFilter,
      dueDateFilters,
      nameFilter,
      subjectFilters,
      scoreStatusFilters,
      flagFilters,
      prevFilters,
    } = this.state;
    if (unitFilter !== prevFilters.unitFilter || nameFilter !== prevFilters.nameFilter) {
      const { dispatchFilterLessons } = this.props;
      this.setState({ prevFilters: { unitFilter, nameFilter } });
      dispatchFilterLessons({ unitFilter, nameFilter });
    }
    let mappableLessons = this.props.lessonList;
    if (nameFilter.length) {
      mappableLessons = this.onFilterByName(mappableLessons);
    }
    if (
      unitFilter.length ||
      scoreStatusFilters.length ||
      subjectFilters.length ||
      flagFilters.length
    ) {
      mappableLessons = this.onFilterLessons(mappableLessons);
    }
    if (dueDateFilters.length) {
      mappableLessons = this.filterDueDate(mappableLessons);
    }
    if (sort) {
      return [...this.onSortLessons(mappableLessons)];
    }
    return mappableLessons;
  };

  // may need to alter dueNextSession depending if client wants ALL vs incomplete/overdue
  // TODO: only works with one due date filter, not multiple
  filterDueDate = (mappableLessons) => {
    const { user } = this.props;
    const { dueDateFilters } = this.state;
    let lessons = mappableLessons;
    if (dueDateFilters.length && dueDateFilters.indexOf("all") === -1) {
      if (dueDateFilters.includes("dueToday")) {
        lessons = lessons.filter((lesson) => lesson.due_date === moment().format("YYYY-MM-DD"));
      }
      if (dueDateFilters.includes("dueNextSession")) {
        lessons = lessons.filter((lesson) =>
          moment(user.nextSession).isSameOrAfter(lesson.dueDate, "day"),
        );
      }
      if (dueDateFilters.includes("overdue")) {
        lessons = lessons.filter((lesson) => lesson.status === 'OVERDUE');
      }
      if (dueDateFilters.includes("noDueDate")) {
        lessons = lessons.filter((lesson) => !lesson.due_date);
      }
      if (dueDateFilters.includes("unAssigned")) {
        lessons = lessons.filter((lesson) => lesson.status === "NOTASSIGNED");
      }
      return lessons;
    }
    return lessons;
  };

  handleFilterClick = (filterType, filter) => {
    const {
      subjectFilters: currentSubjectFilters,
      scoreStatusFilters: currentScoreStatusFilters,
      flagFilters: currentFlagFilters,
      dueDateFilters: currentDueDateFilters,
    } = this.state;
    let modifiedFilterCurrentState;
    let modifiedFilterName;
    let modifiedFilterUpdatedState;
    switch (filterType) {
      case "subject":
        modifiedFilterCurrentState = currentSubjectFilters;
        modifiedFilterName = "subjectFilters";
        break;
      case "score":
        modifiedFilterCurrentState = currentScoreStatusFilters;
        modifiedFilterName = "scoreStatusFilters";
        break;
      case "flags":
        modifiedFilterCurrentState = currentFlagFilters;
        modifiedFilterName = "flagFilters";
        break;
      case "dueDate":
        modifiedFilterCurrentState = currentDueDateFilters;
        modifiedFilterName = "dueDateFilters";
        break;
      default:
        break;
    }
    // Decide whether we're adding or removing the selected filter
    if (modifiedFilterCurrentState.indexOf(filter) === -1) {
      modifiedFilterUpdatedState = update(modifiedFilterCurrentState, {
        $push: [filter],
      });
    } else {
      const filterIndex = modifiedFilterCurrentState.indexOf(filter);
      modifiedFilterUpdatedState = update(modifiedFilterCurrentState, {
        $splice: [[filterIndex, 1]],
      });
    }
    this.setState({ [modifiedFilterName]: modifiedFilterUpdatedState });
  };

  arrayItemRemover = (array, value) => array.filter((lesson) => lesson !== value);

  renderCurrentView = () => {
    const { active } = this.state;
    const { user } = this.props;
    if (active === "full") {
      return (
        <FullView
          user={user}
          lessons={this.getMappableLessons()}
          selectAll={this.state.selectAll}
          onDeleteLesson={this.onDeleteLesson}
          onCloneLesson={this.onCloneLesson}
          onCheckAll={this.onCheckAllClicked}
          onAddCheckedLesson={this.onAddCheckedLesson}
          onRemoveCheckedLesson={this.onRemoveCheckedLesson}
          dropdownIsOpen={this.state.dropdownIsOpen}
          onOpenModal={this.onOpenModal}
          onCloseDropdown={this.onCloseDropdown}
          onOpenDropdown={this.onOpenDropdown}
          renderDropdownOptions={renderDropdownOptions}
          checkedCardIds={this.state.checkedCardIds}
          onAddAssignLessonIds={this.onAddAssignLessonIds}
          resetLessonSelections={this.resetLessonSelections}
          handleMarkAllFlagsReviewed={this.handleMarkAllFlagsReviewed}
          handleExcuseLessonLateness={this.handleExcuseLessonLateness}
        />
      );
    }
    return (
      <ListView
        user={user}
        lessons={this.getMappableLessons()}
        onSetSort={this.onSetSort}
        sort={this.state.sort}
      />
    );
  };

  onAssignLesson = (lessonDates) => {
    const { checkedLessons, studentLess } = this.props;
    // Check if there are lessons to assign
    if (checkedLessons.length <= 0) return null;
    // Check if that lesson has already been assigned
    const payload = {
      student_id: this.props.user.id,
      lesson_ids: checkedLessons,
      assignment_date: lessonDates.assignDate,
      due_date: lessonDates.dueDate,
    };
    const prevAssignedLessons = studentLess.filter((lesson) =>
      checkedLessons.includes(lesson.lesson_id),
    );

    // If lessons have been assigned before, open modal
    if (prevAssignedLessons.length > 0) {
      this.onOpenConfirmModal();
      return this.setState({
        prevAssignedLessons,
        lessonsToAssign: payload,
        confirmationModalMessage: 'One or more lessons you are assigning to this student have previously been assigned. Assign Lessons anyways?',
      });
    }
    // Move onto sending request
    this.submitAssignedLesson(payload);
  }

  submitAssignedLesson = (lessons) => {
    const {
      dispatchAssignLessonToStudent,
    } = this.props;
    this.onCloseConfirmModal();
    // Dispatch assign lesson to student
    let payload = lessons;
    if (!payload) {
      payload = this.state.lessonsToAssign;
    }
    dispatchAssignLessonToStudent(payload);
    // Clear the redux checkedLesson property
    this.resetLessonSelections();
  }

  // Resets redux store, unchecks lessons, resets checked state
  resetLessonSelections = () => {
    const {
      dispatchRemoveAllLessons,
      dispatchUnCheckAllLesson,
    } = this.props;
    dispatchUnCheckAllLesson(this.getMappableLessons());
    dispatchRemoveAllLessons(this.getMappableLessons());
    this.setState({ selectAll: false, prevAssignedLessons: [], lessonsToAssign: {} });
  }

  confirmationModal() {
    return (
      <Modal
        open={this.state.isConfirmModalOpen}
        onConfirm={() => this.submitAssignedLesson()}
        onClose={this.onCloseConfirmModal}
        header="Are you sure?"
        body={this.state.confirmationModalMessage}
      />
    );
  }

  onCloseDetailModal = () => {
    const { onSetOpenActivePage, onSetIsVisibleTopBar } = this.props;
    onSetIsVisibleTopBar(true);
    onSetOpenActivePage("");
  }

  handleMarkAllFlagsReviewed = (studentLessonIds, setLessonList = true) => {
    this.props.onMarkAllLessonFlagsReviewed(studentLessonIds, this.props.studentLess, this.props.user, setLessonList);
    this.resetLessonSelections();
  }

  handleExcuseLessonLateness = (lessonCardIds) => {
    const { onExcuseStudentLateness } = this.props;
    if (lessonCardIds && lessonCardIds.length > 0) {
      this.getMappableLessons().forEach(lesson => {
        if (lessonCardIds.includes(lesson.id)) {
          const payload = {
            student_lesson_id: lesson.id,
            was_excused: !lesson.lateness_excused,
          };
          onExcuseStudentLateness(payload);
        }
      });
      // Deselect all checks and lessons
      this.resetLessonSelections();
    }
  }

  render() {
    const {
      currentView,
      subjectFilters,
      scoreStatusFilters,
      flagFilters,
      dueDateFilters,
    } = this.state;

    const {
      activeShowPage,
    } = this.props;
    return (
      <React.Fragment>
        {this.confirmationModal()}
        <Choose>
          <When condition={activeShowPage === "AnswerSheet"}>
            <LessonDetailAnswerSheet
              onCloseDetailModal={this.onCloseDetailModal}
              user={this.props.user}
              lesson={this.props.activeLesson}
              onOpenModal={this.onOpenModal}
              onAddCheckedLesson={this.onAddCheckedLesson}
              onCloseDropdown={this.onCloseDropdown}
              resetLessonSelections={this.resetLessonSelections}
              handleMarkAllFlagsReviewed={this.handleMarkAllFlagsReviewed}
              handleExcuseLessonLateness={this.handleExcuseLessonLateness}
            />
          </When>
          <When condition={activeShowPage === "ReadWorkBook"}>
            <ReadWorkBook
              onCloseDetailModal={this.onCloseDetailModal}
              user={this.props.user}
              lesson={this.props.activeLesson}
              onOpenModal={this.onOpenModal}
              onAddCheckedLesson={this.onAddCheckedLesson}
              onCloseDropdown={this.onCloseDropdown}
              resetLessonSelections={this.resetLessonSelections}
              handleMarkAllFlagsReviewed={this.handleMarkAllFlagsReviewed}
              handleExcuseLessonLateness={this.handleExcuseLessonLateness}
            />
          </When>
          <Otherwise>
            <FilterSection
              currentView={currentView}
              onChangeView={this.onChangeView}
              onClearFilters={this.onClearFilters}
              onSetFilteredState={this.onSetFilteredState}
              onUnsetFilteredState={this.onUnsetFilteredState}
              onSetSort={this.onSetSort}
              subjectFilters={subjectFilters}
              scoreStatusFilters={scoreStatusFilters}
              flagFilters={flagFilters}
              dueDateFilters={dueDateFilters}
              handleFilterClick={this.handleFilterClick}
              onSetUnitFilter={this.onSetUnitFilter}
              filterDueDate={this.filterDueDate}
            />
            {this.renderCurrentView()}
            <AssignDatesModal
              open={this.state.modalOpen}
              // lessons={this.props.user.lessons}
              lessons={this.props.lessonList}
              onCloseDatesModal={this.onCloseModal}
              onAddUpdatedLessons={this.onAddUpdatedLessons}
              onAssignLesson={this.onAssignLesson.bind(this)}
            />
            <a
              href="#"
              onClick={this.onOpenModal}
              className="waves-effect waves-teal btn add-btn modal-trigger"
            >
              <i className="material-icons">add</i>Assign Lesson
            </a>
          </Otherwise>
        </Choose>
      </React.Fragment>
    );
  }
}

DetailLessonList.propTypes = {
  user: PropTypes.object.isRequired,
  activeLesson: PropTypes.object,
  openAnswerSheetStatus: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispathGetLessonList: bindActionCreators(getLessonList, dispatch),
  dispathGetStudentLessonList: bindActionCreators(getStudentLessonList, dispatch),
  dispathCheckLesson: bindActionCreators(checkLesson, dispatch),
  dispatchCheckAllLesson: bindActionCreators(checkAllLessons, dispatch),
  dispatchUnCheckAllLesson: bindActionCreators(unCheckAllLessons, dispatch),
  dispatchAddCheckedLesson: bindActionCreators(addCheckedLesson, dispatch),
  dispatchRemoveCheckedLesson: bindActionCreators(removeCheckedLesson, dispatch),
  dispatchAssignLessonToStudent: bindActionCreators(assignLessonToStudent, dispatch),
  dispatchAddAllLessons: bindActionCreators(addAllLessons, dispatch),
  dispatchRemoveAllLessons: bindActionCreators(removeAllLessons, dispatch),
  onSetOpenActivePage: bindActionCreators(setOpenActivePage, dispatch),
  onSetIsVisibleTopBar: bindActionCreators(setIsVisibleTopBar, dispatch),
  onExcuseStudentLateness: bindActionCreators(excuseStudentLateness, dispatch),
  dispatchFilterLessons: bindActionCreators(filterLessons, dispatch),
  onFlagStudentLessonProblem: bindActionCreators(flagStudentLessonProblem, dispatch),
  onMarkAllLessonFlagsReviewed: bindActionCreators(markAllLessonFlagsReviewed, dispatch),
});

const mapStateToProps = createStructuredSelector({
  lessonList: makeSelectGetLessonList(),
  studentLess: makeSelectGetStudentLessonList(),
  checkedLessons: makeSelectCheckedLessons(),
  studentToken: makeSelectActiveStudentToken(),
  activeLesson: makeSelectActiveLesson(),
  activeShowPage: makeSelectOpenActivePage(),
  subjects: makeSelectSubjects(),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailLessonList);
