import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import moment from 'moment';
import { setActiveTestScores } from '../../../index/actions';
import { makeSelectActiveTestScores, makeSelectActiveStudent } from '../../../index/selectors';
import { WithHoverEffect } from '../Styled/CompletedCardStyles';

import { fetchStudentTestScoreApi } from '../../../index/api';
class CompletedTestCard extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      scores: null,
      ReadingScore: null,
      WritingScore: null,
      ReadingAndWritingScore: null,
      MathScore: null,
      NA: 0,
    };
  }

  componentDidMount = async () => {
    const { test } = this.props;
    this._isMounted = true;
    const formattedScores = await this.getScoresByStudentTest(this.props.test);
    if (!formattedScores) return;
    if (formattedScores && this._isMounted) {
      this.setState({
        scores: { ...formattedScores, student_test_id: test.student_test_id },
      });
      this.setScores(formattedScores.subjects);
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  onEditTest = async () => {
    const { onEditTest, onSetScores } = this.props;
    const { scores } = this.state;
    if (scores) {
      onSetScores(scores);
      onEditTest();
    }
  };

  setScores = scores => {
    Object.values(scores).map(score => {
      switch (score.name) {
        case 'Reading':
          this.setState({ ReadingScore: score });
          break;
        case 'Writing and Language':
          this.setState({ ReadingAndWritingScore: score });
          break;
        case 'Math':
          this.setState({ MathScore: score });
          break;
        case 'Writing':
          this.setState({ WritingScore: score });
          break;
        default:
          this.setState({ NA: 0 });
          break;
      }
    });
  };

  getScoresByStudentTest = async test => {
    const { student_test_id } = test;
    const { activeStudent: { id } } = this.props;
    const formattedTestScores = await fetchStudentTestScoreApi(id, student_test_id);
    return formattedTestScores.data;
  };

  handleDropdownClick = event => {
    const { onSetDropdown, onCloseDropdown, dropdownIsOpen, index } = this.props;
    event.preventDefault();
    if (dropdownIsOpen) {
      return onCloseDropdown();
    }
    return onSetDropdown(index);
  };

  render() {
    const {
      dropdownIndex,
      index,
      dropdownIsOpen,
      onDownloadReport,
      test: {
        test_name,
        test_description,
        due_date,
        completion_date,
        student_test_id,
        student_id,
        problem_flag_count,
      },
      onEnterAnswers,
      onDeleteTest,
      onTestFlagReviewed,
      handleTestSettingModalOpen,
    } = this.props;
    const { ReadingScore, WritingScore, ReadingAndWritingScore, MathScore } = this.state;
    const formattedDueDate = moment(due_date).format('MM/DD/YY');
    const formattedCompletedDate = moment(completion_date.date).format('MM/DD/YY');
    return (
      <React.Fragment>
        <div className="card-full-width card-scored card" style={{ margin: '10px' }}>
          <div className="card-content">
            <div className=" card-panel-row row mb-0">
              <div className="col s12">
                <ul className="to-do-list">
                  <li>
                    <div
                      className="row"
                      style={{ marginBottom: '0px !important', marginTop: '20px' }}
                    >
                      <div className="col s12 m6">
                        <strong className="list-title" >
                          {test_name}
                        </strong>
                      </div>
                      <div className="col s12 m6 right-align">
                        <div className="row icons-row" style={{ marginBottom: '10px' }}>
                          {problem_flag_count > 0 &&
                            <span
                              className="badge-rounded-xs badge red darken-2 white-text"
                              style={{
                                minWidth: '20px',
                                minHeight: '20px',
                                borderRadius: '50%',
                              }}
                            >
                              <i className="icon-flag" />
                            </span>}
                          <div className="dropdown-block col">
                            <a
                              href="#"
                              className="dropdown-trigger btn"
                              onClick={this.handleDropdownClick}
                            >
                              <i className="material-icons dots-icon">more_vert</i>
                            </a>
                            <If condition={dropdownIsOpen && dropdownIndex === index}>
                              <ul
                                id="dropdown01"
                                style={{
                                  display: 'block',
                                  minWidth: '160px',
                                  transformOrigin: '0px 0px 0px',
                                  opacity: '1',
                                  transform: 'scaleX(1) scaleY(1)',
                                  width: '210px',
                                }}
                                className="dropdown-content"
                              >
                                <li>
                                  <a href="#" onClick={handleTestSettingModalOpen}>
                                    Edit Test Settings
                                  </a>
                                </li>
                                <li>
                                  <a href="#" onClick={() => onEnterAnswers(student_test_id)}>
                                    Edit/Enter Answers
                                  </a>
                                </li>
                                <li>
                                  <a href="#" onClick={() => onDownloadReport(this.props.test)}>
                                    Download score report
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="disabled">
                                    Excuse/Unexcuse lateness
                                  </a>
                                </li>
                                <li>
                                  <a
                                    className={problem_flag_count === 0 ? "disabled" : ""}
                                    href="#"
                                    onClick={e => {
                                      e.preventDefault();
                                      onTestFlagReviewed(student_test_id, student_id, problem_flag_count);
                                    }}
                                  >
                                    Mark flags reviewed
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="disabled">
                                    Reset
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    onClick={e => {
                                      e.preventDefault();
                                      onDeleteTest(
                                        student_test_id,
                                        student_id,
                                        'completedStudentTests',
                                      );
                                    }}
                                    className="red-text text-darken-3"
                                  >
                                    Unassign
                                  </a>
                                </li>
                              </ul>
                            </If>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row" onClick={e => this.onEditTest(e)}>
                      <div className="col s12 m8">
                        <ul className="info-list info-list-gray  assigned">
                          <li>
                            <span className="list-status">
                              <span className="ico-mark" />
                              <span className="status-text">
                                Complete {formattedCompletedDate}
                              </span>
                            </span>
                          </li>
                          <li>
                            <span className="list-date">
                              <i className="icon-calendar" />
                              <span className="date">
                                Due {formattedDueDate}
                              </span>
                            </span>
                          </li>
                        </ul>
                        <div
                          className="card-meta-block"
                          style={{ padding: '0px', marginTop: '10px' }}
                        >
                          <dl className="dl-horizontal">
                            <dt>Version:</dt>
                            <dd>
                              {test_description}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <ul className="points-list-custom" onClick={e => this.onEditTest(e)}>
              {MathScore && ReadingAndWritingScore && ReadingScore
                ? <li>
                  <WithHoverEffect
                    math={MathScore}
                    reading={ReadingScore}
                    readingWriting={ReadingAndWritingScore}
                    className="badge-circle"
                    style={{
                      backgroundColor: '#00BBFF',
                      borderColor: '#00BBFF',
                      width: '120px',
                      height: '120px',
                      fontSize: '55px',
                    }}
                  >
                    <span className="badge-text">
                      <strong>
                        <h2 style={{ marginBottom: '5px' }}>SAT Score</h2>
                      </strong>
                      <h2 style={{ marginBottom: '20px' }}>
                        {MathScore.current_score +
                            ReadingScore.current_score +
                            ReadingAndWritingScore.current_score}
                      </h2>
                    </span>
                  </WithHoverEffect>
                </li>
                : <li>
                  <span
                    className="badge-circle"
                    style={{
                      width: '120px',
                      height: '120px',
                      fontSize: '55px',
                    }}
                  >
                    <span className="badge-text">
                      <strong>
                        <h2 style={{ marginBottom: '10px' }}>SAT Score</h2>
                      </strong>
                      <h2 style={{ marginBottom: '15px' }}>n/a</h2>
                    </span>
                  </span>
                </li>}
              {MathScore
                ? <li>
                  <WithHoverEffect
                    className="badge-circle"
                    style={{
                      backgroundColor: '#4785f4',
                      borderColor: '#4785f4',
                    }}
                  >
                    <span className="badge-text">
                      <strong>
                        <h2 style={{ marginBottom: '5px' }}>Math</h2>
                      </strong>
                      <h2 style={{ marginBottom: MathScore.previous_score ? '5px' : '20px' }}>
                        {MathScore.current_score}
                        <br />
                        {MathScore.previous_score === null ? '' : `${MathScore.delta}`}
                      </h2>
                    </span>
                  </WithHoverEffect>
                </li>
                : <li>
                  <span className="badge-circle">
                    <span className="badge-text">
                      <strong>
                        <h2 style={{ marginBottom: '10px' }}>Math</h2>
                      </strong>
                      <h2 style={{ marginBottom: '15px' }}>n/a</h2>
                    </span>
                  </span>
                </li>}
              {ReadingAndWritingScore
                ? <li>
                  <WithHoverEffect
                    className="badge-circle"
                    style={{
                      backgroundColor: '#55b24b',
                      borderColor: '#55b24b',
                    }}
                  >
                    <span className="badge-text" style={{ fontSize: '16px' }}>
                      <strong>
                          Writing
                        {/* <br />
                                &amp; Language */}
                      </strong>
                      <h2
                        style={{
                          marginBottom: ReadingAndWritingScore.previous_score ? '' : '15px',
                        }}
                      >
                        {ReadingAndWritingScore.current_score}
                        <br />
                        {ReadingAndWritingScore.previous_score === null
                          ? ''
                          : `${ReadingAndWritingScore.delta}`}
                      </h2>
                    </span>
                  </WithHoverEffect>
                </li>
                : <li>
                  <span className="badge-circle">
                    <span className="badge-text" style={{ fontSize: '16px', marginBottom: '10px' }}>
                      <strong>
                          Writing
                        {/* <br />
                                &amp; Language */}
                      </strong>
                      <h2>n/a</h2>
                    </span>
                  </span>
                </li>}

              {ReadingScore
                ? <li>
                  <WithHoverEffect
                    className="badge-circle"
                    style={{
                      backgroundColor: '#35a6af',
                      borderColor: '#35a6af',
                      width: '80px',
                      height: '80px',
                    }}
                  >
                    <span className="badge-text" style={{ fontSize: '16px' }}>
                        Reading
                      <br />
                      <h3 style={{ marginBottom: ReadingScore.previous_score ? '' : '20px' }}>
                        {ReadingScore.current_score}
                        <br />
                        {ReadingScore.previous_score === null ? '' : `${ReadingScore.delta}`}
                      </h3>
                    </span>
                  </WithHoverEffect>
                </li>
                : <li>
                  <span
                    className="badge-circle"
                    style={{
                      width: '80px',
                      height: '80px',
                    }}
                  >
                    <span className="badge-text" style={{ fontSize: '16px' }}>
                        Reading
                      <br />
                      <h3 style={{ marginTop: '10px' }}>n/a</h3>
                    </span>
                  </span>
                </li>}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

CompletedTestCard.propTypes = {
  index: PropTypes.string,
  dropdownIndex: PropTypes.string,
  onSetDropdown: PropTypes.func.isRequired,
  dropdownIsOpen: PropTypes.bool.isRequired,
  onCloseDropdown: PropTypes.func.isRequired,
  onDownloadReport: PropTypes.func.isRequired,
  test: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  scores: makeSelectActiveTestScores(),
  activeStudent: makeSelectActiveStudent(),
});

const mapDispatchToProps = dispatch => ({
  onSetScores: scores => dispatch(setActiveTestScores(scores)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CompletedTestCard);
