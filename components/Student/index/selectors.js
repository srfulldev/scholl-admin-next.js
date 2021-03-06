import { createSelector } from "reselect";

const selectStudentsDomain = state => state.studentReducer;

const makeSelectStudentPageState = () =>
  createSelector(selectStudentsDomain, substate => (substate ? substate.toJS() : {}));

const makeSelectStudents = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.students);

// Lessons
const makeSelectGetLessonList = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.lessonList);

const makeSelectGetStudentLessonList = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.studentLessonList);

const makeSelectCheckedLessons = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.checkedLessons);

const makeSelectAssignLessonsModalOpen = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.assignLessonsModalOpen);

const makeSelectAssignWorkSheetsModalOpen = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.assignWorkSheetsModalOpen);

const makeSelectCalendarRows = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.calendarRows);

const makeSelectIsVisibleTopBar = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.isVisibleTopBar);

const makeSelectActiveTestScores = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.activeTestScores);

const makeSelectOverDueStudentTests = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.overdueStudentTests);
const makeSelectCompletedStudentTests = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.completedStudentTests);
const makeSelectAssignedStudentTests = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.assignedStudentTests);

const makeSelectStudentTests = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.studentTests);
const makeSelectStudentSections = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.sections);
const makeSelectActiveStudentTestId = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.activeStudentTestId);
const makeSelectUnitFilterOptions = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.unitFilterOptions);
const makeSelectActiveStudentToken = () =>
  createSelector(makeSelectStudentPageState(), substate => substate.activeStudentToken);

const makeSelectActiveLesson = () => createSelector(makeSelectStudentPageState(), substate => substate.activeLesson);
const makeSelectOpenAnswerSheetStatus = () => createSelector(makeSelectStudentPageState(), substate => substate.openAnswerSheet);
const makeSelectSubjects = () => createSelector(makeSelectStudentPageState(), substate => substate.subjects);

const makeSelectOpenActivePage = () => createSelector(makeSelectStudentPageState(), substate => substate.activeShowPage);

const makeSelectTests = () => createSelector(makeSelectStudentPageState(), substate => substate.tests);

const makeSelectActiveStudent = () => createSelector(makeSelectStudentPageState(), substate => substate.activeStudent);

const makeSelectFetchStudentTestsStatus = () => createSelector(makeSelectStudentPageState(), substate => substate.studentTestsFetchedStatus);

const makeSelectErrorMessages = () => createSelector(makeSelectStudentPageState(), substate => substate.errorMessages);

export default selectStudentsDomain;
export {
  makeSelectStudentPageState,
  makeSelectAssignLessonsModalOpen,
  makeSelectAssignWorkSheetsModalOpen,
  makeSelectCalendarRows,
  makeSelectStudents,
  makeSelectIsVisibleTopBar,
  makeSelectActiveTestScores,
  makeSelectOverDueStudentTests,
  makeSelectCompletedStudentTests,
  makeSelectAssignedStudentTests,
  makeSelectStudentTests,
  makeSelectStudentSections,
  makeSelectActiveStudentTestId,
  makeSelectGetLessonList,
  makeSelectUnitFilterOptions,
  makeSelectActiveStudentToken,
  makeSelectCheckedLessons,
  makeSelectGetStudentLessonList,
  makeSelectActiveLesson,
  makeSelectOpenAnswerSheetStatus,
  makeSelectSubjects,
  makeSelectOpenActivePage,
  makeSelectTests,
  makeSelectActiveStudent,
  makeSelectFetchStudentTestsStatus,
  makeSelectErrorMessages,
};
