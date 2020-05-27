import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import AnswerSheetNavBar from './components/AnswerSheetNavBar';
import ReadingPage from './components/ReadingPage';
import WritingPage from './components/WritingPage';
import MathNoCalcPage from './components/MathNoCalcPage';
import MathCalculatorPage from './components/MathCalculatorPage';
import EssayPage from './components/EssayPage';
import {
  makeSelectStudentSections,
  makeSelectActiveStudentToken,
  makeSelectActiveStudent,
  makeSelectTests,
  makeSelectActiveStudentTestId,
  makeSelectActiveTestScores,
} from '../index/selectors';

import { fetchStudentTestSections, addStudentAnswerToTest, setEssayScore } from '../index/actions';
import { updateStudentTestSectionStatusApi } from '../index/api';

class DetailTestAnswerSheetComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: '',
      isOpened: false,
      testSections: [],
      studentTestId: '',
      testReadingProblems: null,
      testWritingProblems: null,
      testMathCalcProblems: null,
      testMathNoCalcProblems: null,
      activeTestSection: null,
      updatedState: {
        activeReadingSection: false,
        showInCompleteTest: false,
        activeWritingSection: false,
        activeMathNoCalcSection: false,
        activeMathWithCalcSection: false,
        activeSection: '',
      },
      updatedSectionStatus: {},
      showSectionMessage: false,
    };
  }

  componentDidMount() {
    const {
      onFetchStudentTestSections,
      sections,
      studentToken,
      testScoreDetails: { student_test_id },
      activeStudent: { id },
    } = this.props;
    // @TODO we need a better  solution than checking for sections
    // The problem is that sections will always exist after clicking the first test and no new test will ever get fetched.
    // if (sections.length === 0) {
    const postBody = {
      id,
      student_test_id,
      studentToken,
    };
    onFetchStudentTestSections(postBody);
    // } else {
    //   this.onSetProblems(sections, student_test_id);
    // }
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  componentWillReceiveProps = nextProps => {
    const { sections, student_test_id } = nextProps;
    if (sections.length !== 0) {
      this.onSetProblems(sections, student_test_id);
    }
  };

  onSetProblems = (sections, studentTestId) => {
    const { tests, testScoreDetails: { test_id } } = this.props;
    const testIds = tests.map(test => test.id);
    const currentTestIndex = testIds.findIndex(testId => testId === test_id);
    const currentTestSections = tests[currentTestIndex].test_sections;
    sections.map(section => {
      const testSectionIds = currentTestSections.map(testSection => testSection.id);
      const currentTestSectionIndex = testSectionIds.findIndex(
        testSectionId => testSectionId === section.test_section_id,
      );
      const currentTestSection = currentTestSections[currentTestSectionIndex];
      if (!currentTestSection) return;
      switch (currentTestSection.name) {
        case 'Math (Calculator)':
          this.setState({
            testMathCalcProblems: section,
          });
          break;
        case 'Writing':
          this.setState({
            testWritingProblems: section,
          });
          break;
        case 'Math (No Calculator)':
          this.setState({
            testMathNoCalcProblems: section,
          });
          break;
        case 'Reading':
          this.setState({
            testReadingProblems: section,
          });
          break;
        default:
          this.setState({
            testReadingProblems: section,
          });
          break;
      }
    });
    this.setState({
      testSections: sections,
      studentTestId,
      showSectionMessage: false,
    });
  };

  delayToGetSections(ms) {
    let delayTime = 0;
    if (this.props.sections.length === 0) {
      delayTime = ms;
    } else {
      delayTime = 1000;
    }
    return new Promise(resolve =>
      setTimeout(() => {
        resolve();
      }, delayTime),
    );
  }

  getComponentImages = () =>
    this.delayToGetSections(5000).then(
      () =>
        new Promise(resolve => {
          const imgDataList = [];
          const componentRefs = [
            { id: 'readingAnswerSheetImg', state: 'reading' },
            { id: 'writingAnswerSheetImg', state: 'writing' },
            { id: 'mathNoCalcAnswerSheetImg', state: 'math (no calc)' },
            { id: 'mathCalcAnswerSheetImg', state: 'math (calculator)' },
          ];
          const getImgListPromise = componentRefs.reduce(
            (accumulatorPromise, item) =>
              accumulatorPromise
                .then(async () => {
                  const result = await this.getData(item);
                  return imgDataList.push(result);
                })
                .catch(console.error),
            Promise.resolve(),
          );
          getImgListPromise.then(() => {
            resolve(imgDataList);
          });
        }),
    );

  getData = item =>
    new Promise(resolve => {
      this.setState({ activeSlide: item.state }, async () => {
        const currentImg = await this.onHandleTargetImage(item.id);
        resolve(currentImg);
      });
    });

  onHandleTargetImage = async currentRef => {
    const { getTargetImage } = this.props;
    const currentImg = await getTargetImage(document.getElementById(currentRef));
    return currentImg;
  };

  onSetActiveSlide = activeSlide => {
    const {
      testReadingProblems,
      testWritingProblems,
      testMathCalcProblems,
      testMathNoCalcProblems,
    } = this.state;
    let currentSection;
    switch (activeSlide) {
      case 'reading':
        currentSection = testReadingProblems;
        break;
      case 'writing':
        currentSection = testWritingProblems;
        break;
      case 'math (no calc)':
        currentSection = testMathNoCalcProblems;
        break;
      case 'math (calculator)':
        currentSection = testMathCalcProblems;
        break;
      default:
        currentSection = testReadingProblems;
        break;
    }
    this.setState({ activeSlide, activeTestSection: currentSection });
  };

  renderCurrentSlide = () => {
    const { activeSlide } = this.state;
    const { sections, activeStudentTestId, activeTestScores, onSetEssayScore } = this.props;
    if (sections) {
      const {
        testReadingProblems,
        testWritingProblems,
        testMathCalcProblems,
        testMathNoCalcProblems,
      } = this.state;
      if (activeSlide === 'reading') {
        this.updateSectionStatus(activeSlide, testReadingProblems);
        return (
          testReadingProblems &&
          <ReadingPage
            testSection={testReadingProblems}
            onAddStudentAnswerToTest={this.onAddStudentAnswerToTest}
          />
        );
      }
      if (activeSlide === 'writing') {
        this.updateSectionStatus(activeSlide, testWritingProblems);
        return (
          testWritingProblems &&
          <WritingPage
            testSection={testWritingProblems}
            onAddStudentAnswerToTest={this.onAddStudentAnswerToTest}
          />
        );
      }
      if (activeSlide === 'math (no calc)') {
        this.updateSectionStatus(activeSlide, testMathNoCalcProblems);
        return (
          testMathNoCalcProblems &&
          <MathNoCalcPage
            testSection={testMathNoCalcProblems}
            onAddStudentAnswerToTest={this.onAddStudentAnswerToTest}
          />
        );
      }
      if (activeSlide === 'math (calculator)') {
        this.updateSectionStatus(activeSlide, testMathCalcProblems);
        return (
          testMathCalcProblems &&
          <MathCalculatorPage
            testSection={testMathCalcProblems}
            onAddStudentAnswerToTest={this.onAddStudentAnswerToTest}
          />
        );
      }
      if (activeSlide === 'essay') {
        return (
          <EssayPage
            testId={activeStudentTestId}
            testScores={activeTestScores}
            setEssayScore={onSetEssayScore}
          />
        );
      }
    } else {
      return null;
    }
  };

  onAddStudentAnswerToTest = async (problem, answer, student_test_id) => {
    const { dispatchAddStudentAnswerToTest } = this.props;
    const postBody = {
      student_test_id,
      test_problem_id: problem.id,
      answer,
    };
    dispatchAddStudentAnswerToTest(postBody, problem.test_section_id);
  };

  updateSectionStatus = async (activeSlide, currentSection) => {
    if (!currentSection) return;
    if (currentSection.test_section_status === 'CREATED') {
      if (!this.state.updatedSectionStatus[`${activeSlide}Section`]) {
        const postBody = {
          student_test_id: currentSection.student_test_id,
          student_test_section_id: currentSection.id,
          student_test_section_status: 'STARTED',
        };
        await updateStudentTestSectionStatusApi(postBody);
        this.setState({
          updatedSectionStatus: {
            ...this.state.updatedSectionStatus,
            [`${activeSlide}Section`]: 'STARTED',
          },
        });
      }
    }
  };

  getExistingSections = () => {
    const {
      testReadingProblems,
      testWritingProblems,
      testMathCalcProblems,
      testMathNoCalcProblems,
    } = this.state;
    return {
      reading: !!testReadingProblems,
      writing: !!testWritingProblems,
      mathCalc: !!testMathCalcProblems,
      mathNoCalc: !!testMathNoCalcProblems,
    };
  };

  render() {
    const {
      activeSlide,
      activeTestSection,
      testReadingProblems,
      testWritingProblems,
      testMathCalcProblems,
      testMathNoCalcProblems,
    } = this.state;
    const { completedSections } = this.props;
    let showSectionMessage = this.state.showSectionMessage;
    switch (activeSlide) {
      case 'reading':
        if (completedSections.readingSectionCompleted) {
          showSectionMessage = true;
        }
        break;
      case 'writing':
        if (completedSections.writingSectionCompleted) {
          showSectionMessage = true;
        }
        break;
      case 'math (no calc)':
        if (completedSections.mathNoCalcSectionCompleted) {
          showSectionMessage = true;
        }
        break;
      case 'math (calculator)':
        if (completedSections.mathCalcSectionCompleted) {
          showSectionMessage = true;
        }
        break;
      default:
        break;
    }
    return (
      <div className="card-main-full card">
        <div className="slick-tabs-gallery">
          <AnswerSheetNavBar
            activeSlide={activeSlide}
            onSetActiveSlide={this.onSetActiveSlide}
            updateSectionStatus={this.updateSectionStatus}
            getExistingSections={this.getExistingSections()}
          />
        </div>
        <div className="card-content">
          {showSectionMessage &&
            <p
              style={{
                color: 'white',
                backgroundColor: '#28a745',
                fontSize: '14px',
                borderRadius: '25px',
              }}
              className="center-align"
            >
              This test section is complete. You can still edit answer choices if needed.
            </p>}
          <div className="main-slick">
            {this.renderCurrentSlide()}
          </div>
          {activeSlide !== 'essay' && !showSectionMessage &&
            <div className="row">
              <div className="btn-holder right-align">
                <a
                  href="#"
                  className="btn btn-xlarge waves-effect waves-light bg-blue"
                  onClick={() =>
                    this.props.handleTestScore(activeTestSection, {
                      testReadingProblems,
                      testWritingProblems,
                      testMathNoCalcProblems,
                      testMathCalcProblems,
                    })}
                >
                  Score Test Section
                </a>
              </div>
            </div>}
        </div>
      </div>
    );
  }
}

DetailTestAnswerSheetComplete.propTypes = {
  getTargetImage: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  sections: makeSelectStudentSections(),
  studentToken: makeSelectActiveStudentToken(),
  activeStudent: makeSelectActiveStudent(),
  tests: makeSelectTests(),
  activeStudentTestId: makeSelectActiveStudentTestId(),
  activeTestScores: makeSelectActiveTestScores(),
});
function mapDispatchToProps(dispatch) {
  return {
    onFetchStudentTestSections: postBody => dispatch(fetchStudentTestSections(postBody)),
    onSetEssayScore: score => dispatch(setEssayScore(score)),
    dispatchAddStudentAnswerToTest: (payload, sectionId) =>
      dispatch(addStudentAnswerToTest(payload, sectionId)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(DetailTestAnswerSheetComplete);
