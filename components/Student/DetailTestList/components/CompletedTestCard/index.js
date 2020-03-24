import React from "react";
<<<<<<< HEAD
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import PropTypes from "prop-types";
import moment from "moment";

import { setActiveTestScores } from "../../../index/actions";
import { makeSelectActiveTestScores } from "../../../index/selectors";

import { fetchStudentTestScoreApi } from "../../../index/api";
=======
import PropTypes from "prop-types";
import moment from "moment";
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
class CompletedTestCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ReadingScore: null,
      WritingScore: null,
      ReadingAndWrigingScore: null,
      MathScore: null,
      NA: 0
    };
  }

<<<<<<< HEAD
  componentDidMount = async () => {
    const { scores, onSetScores } = this.props;
    if (scores.length === 0) {
      const formattedScores = await this.getScoresByStudentTest(this.props.test);
      onSetScores(formattedScores);
      this.setScores(formattedScores);
    } else {
      this.setScores(scores);
    }
  };

  setScores = scores => {
    scores.map(score => {
=======
  componentWillReceiveProps = nextProps => {
    const scores = nextProps.scores;
    scores.map((score, index) => {
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
      switch (score.subject_name) {
        case "Reading":
          this.setState({ ReadingScore: score });
          break;
        case "Writing and Language":
          this.setState({ ReadingAndWrigingScore: score });
          break;
        case "Math":
          this.setState({ MathScore: score });
          break;
        case "Writing":
          this.setState({ WritingScore: score });
          break;
        default:
          this.setState({ NA: 0 });
      }
    });
  };

<<<<<<< HEAD
  getScoresByStudentTest = async test => {
    const { student_test_id } = test;
    const { formattedTestScores } = await fetchStudentTestScoreApi(student_test_id);
    return formattedTestScores.scores;
  };

  handleDropdownClick = event => {
    const { onSetDropdown, onCloseDropdown, dropdownIsOpen, index } = this.props;
=======
  handleDropdownClick = event => {
    const {
      onSetDropdown,
      onCloseDropdown,
      dropdownIsOpen,
      index
    } = this.props;
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
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
<<<<<<< HEAD
      test: { test_name, test_description, dueDate, completion_date, test_id },
      onEditTest,
      onEnterAnswers
    } = this.props;
    const { ReadingScore, WritingScore, ReadingAndWrigingScore, MathScore } = this.state;
    const formattedDueDate = moment(dueDate).format("MM/DD/YY");
    const formattedCompletedDate = moment(completion_date).format("MM/DD/YY");
    return (
      <React.Fragment>
        <div className="card-full-width card-scored card" style={{ margin: "10px" }}>
          <div className="card-content">
            <div className=" card-panel-row row mb-0">
              <div className="col s12">
                <ul className="to-do-list">
                  <li>
                    <div
                      className="row"
                      style={{ marginBottom: "0px !important", marginTop: "20px" }}
                    >
                      <div className="col s12 m6">
                        <strong className="list-title">{test_name}</strong>
                      </div>
                      <div className="col s12 m6 right-align">
                        <div className="row icons-row" style={{ marginBottom: "10px" }}>
                          <span
                            className="badge-rounded-xs badge red darken-2 white-text"
                            style={{
                              minWidth: "20px",
                              minHeight: "20px",
                              borderRadius: "50%"
                            }}
                          >
                            <i className="icon-flag"></i>
                          </span>
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
                                  display: "block",
                                  minWidth: "160px",
                                  transformOrigin: "0px 0px 0px",
                                  opacity: "1",
                                  transform: "scaleX(1) scaleY(1)",
                                  width: "210px"
                                }}
                                className="dropdown-content"
                              >
                                <li>
                                  <a href="#" onClick={() => onEnterAnswers(test_id)}>
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
                                  <a href="#" className="disabled">
                                    Mark flags reviewed
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="disabled">
                                    Reset
                                  </a>
                                </li>
                                <li>
                                  <a href="#" className="red-text text-darken-3">
                                    Unassign
                                  </a>
                                </li>
                              </ul>
                            </If>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row" onClick={onEditTest}>
                      <div className="col s12 m8">
=======
      onDeleteTest,
      onDetailTest,
      test: { test_name, test_description, assignment_date, dueDate }
    } = this.props;
    const {
      ReadingScore,
      WritingScore,
      ReadingAndWrigingScore,
      MathScore,
      NA
    } = this.state;
    const formattedDueDate = moment(dueDate).format("MM/DD/YY");
    const formattedAssignmentDate = moment(assignment_date).format("MM/DD/YY");
    return (
      <React.Fragment>
        <div
          className="card-full-width card-scored card"
          style={{ margin: "10px" }}
        >
          <div className="card-content">
            <div className=" card-panel-row row mb-0">
              <div className="col s12 right-align">
                <div className="row icons-row" style={{ marginBottom: "10px" }}>
                  <span
                    className="badge-rounded-xs badge red darken-2 white-text"
                    style={{
                      minWidth: "20px",
                      minHeight: "20px",
                      borderRadius: "50%"
                    }}
                  >
                    <i className="icon-flag"></i>
                  </span>
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
                          display: "block",
                          minWidth: "160px",
                          transformOrigin: "0px 0px 0px",
                          opacity: "1",
                          transform: "scaleX(1) scaleY(1)"
                        }}
                        className="dropdown-content"
                      >
                        <li>
                          <a href="#" onClick={onDetailTest}>
                            Edit
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            onClick={onDownloadReport}
                            className="disabled"
                          >
                            Download Report
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            // onClick={onDeleteTest}
                            className="red-text text-darken-3"
                          >
                            Delete
                          </a>
                        </li>
                      </ul>
                    </If>
                  </div>
                </div>
              </div>
              <div className="col s12">
                <ul className="to-do-list">
                  <li>
                    <div className="row">
                      <div className="col s12 m12">
                        <strong className="list-title">{test_name}</strong>
                      </div>
                      <div className="col s12 m6">
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
                        <ul className="info-list info-list-gray  assigned">
                          <li>
                            <span className="list-status">
                              <span className="ico-mark" />
<<<<<<< HEAD
                              <span className="status-text">Complete {formattedCompletedDate}</span>
=======
                              <span className="status-text">
                                Complete 6/3/20
                              </span>
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
                            </span>
                          </li>
                          <li>
                            <span className="list-date">
                              <i className="icon-calendar" />
<<<<<<< HEAD
                              <span className="date">Due {formattedDueDate}</span>
=======
                              <span className="date">
                                Due {formattedDueDate}
                              </span>
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
                            </span>
                          </li>
                        </ul>
                        <div
                          className="card-meta-block"
                          style={{ padding: "0px", marginTop: "10px" }}
                        >
                          <dl className="dl-horizontal">
                            <dt>Version:</dt>
                            <dd>{test_description}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
<<<<<<< HEAD
            <ul className="points-list-custom" onClick={onEditTest}>
=======
            <ul className="points-list-custom">
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
              <li className="point-custom-large">
                <span
                  className="badge-circle"
                  style={{
                    width: "120px",
                    height: "120px",
                    fontSize: "55px"
                  }}
                >
                  n/a
                </span>
              </li>
              {MathScore ? (
                <li>
                  <span
                    className="badge-circle"
                    style={{
                      backgroundColor: "#4785f4",
                      borderColor: "#4785f4"
                    }}
                  >
                    <span className="badge-text">
                      <strong>
                        <h2 style={{ marginBottom: "5px" }}>Math</h2>
                      </strong>
                      <h2
                        style={
                          MathScore.previous_score
                            ? { marginBottom: "5px" }
                            : { marginBottom: "20px" }
                        }
                      >
                        {MathScore.current_score}
                        <br />
<<<<<<< HEAD
                        {MathScore.previous_score === null ? "" : "+" + MathScore.delta}
=======
                        {MathScore.previous_score === null
                          ? ""
                          : "+" + MathScore.delta}
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
                      </h2>
                    </span>
                  </span>
                </li>
              ) : (
                <li>
                  <span className="badge-circle">
                    <span className="badge-text">
                      <strong>
                        <h2 style={{ marginBottom: "10px" }}>Math</h2>
                      </strong>
                      <h2 style={{ marginBottom: "15px" }}>n/a</h2>
                    </span>
                  </span>
                </li>
              )}
              {ReadingAndWrigingScore ? (
                <li>
                  <span
                    className="badge-circle"
                    style={{
                      backgroundColor: "#55b24b",
                      borderColor: "#55b24b"
                    }}
                  >
                    <span className="badge-text" style={{ fontSize: "16px" }}>
                      <strong>
                        Reading
                        <br />
                        &amp; Writing
                      </strong>
                      <h2
                        style={
                          ReadingAndWrigingScore.previous_score === null
                            ? { marginBottom: "15px" }
                            : ""
                        }
                      >
                        {ReadingAndWrigingScore.current_score}
                        <br />
                        {ReadingAndWrigingScore.previous_score === null
                          ? ""
                          : "+" + ReadingAndWrigingScore.delta}
                      </h2>
                    </span>
                  </span>
                </li>
              ) : (
                <li>
                  <span className="badge-circle">
<<<<<<< HEAD
                    <span className="badge-text" style={{ fontSize: "16px", marginBottom: "10px" }}>
=======
                    <span
                      className="badge-text"
                      style={{ fontSize: "16px", marginBottom: "10px" }}
                    >
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
                      <strong>
                        Reading
                        <br />
                        &amp; Writing
                      </strong>
                      <h2>n/a</h2>
                    </span>
                  </span>
                </li>
              )}

              {ReadingScore ? (
                <li>
                  <span
                    className="badge-circle"
                    style={{
                      backgroundColor: "#35a6af",
                      borderColor: "#35a6af",
                      width: "80px",
                      height: "80px"
                    }}
                  >
                    <span className="badge-text" style={{ fontSize: "16px" }}>
                      Reading
                      <br />
                      <h3
<<<<<<< HEAD
                        style={ReadingScore.previous_score === null ? { marginBottom: "20px" } : ""}
                      >
                        {ReadingScore.current_score}
                        <br />
                        {ReadingScore.previous_score === null ? "" : "+" + ReadingScore.delta}
=======
                        style={
                          ReadingScore.previous_score === null
                            ? { marginBottom: "20px" }
                            : ""
                        }
                      >
                        {ReadingScore.current_score}
                        <br />
                        {ReadingScore.previous_score === null
                          ? ""
                          : "+" + ReadingScore.delta}
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
                      </h3>
                    </span>
                  </span>
                </li>
              ) : (
                <li>
                  <span
                    className="badge-circle"
                    style={{
                      width: "80px",
                      height: "80px"
                    }}
                  >
                    <span className="badge-text" style={{ fontSize: "16px" }}>
                      Reading
                      <br />
                      <h3 style={{ marginTop: "10px" }}>n/a</h3>
                    </span>
                  </span>
                </li>
              )}
              {WritingScore ? (
                <li>
                  <span
                    className="badge-circle"
                    style={{
                      backgroundColor: "#389b7d",
                      borderColor: "#389b7d",
                      width: "80px",
                      height: "80px"
                    }}
                  >
<<<<<<< HEAD
                    <span className="badge-text" style={{ fontSize: "16px", marginBottom: "10px" }}>
=======
                    <span
                      className="badge-text"
                      style={{ fontSize: "16px", marginBottom: "10px" }}
                    >
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
                      Writing
                      <br />
                      <h4>
                        {WritingScore.current_score}
                        <br />
<<<<<<< HEAD
                        {WritingScore.previous_score === null ? "" : "+" + WritingScore.delta}
=======
                        {WritingScore.previous_score === null
                          ? ""
                          : "+" + WritingScore.delta}
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
                      </h4>
                    </span>
                  </span>
                </li>
              ) : (
                <li>
                  <span
                    className="badge-circle"
                    style={{
                      width: "80px",
                      height: "80px"
                    }}
                  >
<<<<<<< HEAD
                    <span className="badge-text" style={{ fontSize: "16px", marginBottom: "10px" }}>
=======
                    <span
                      className="badge-text"
                      style={{ fontSize: "16px", marginBottom: "10px" }}
                    >
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
                      Writing
                      <br />
                      <h2>n/a</h2>
                    </span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

CompletedTestCard.propTypes = {
<<<<<<< HEAD
=======
  scores: PropTypes.array,
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
  index: PropTypes.string,
  dropdownIndex: PropTypes.string,
  onSetDropdown: PropTypes.func.isRequired,
  dropdownIsOpen: PropTypes.bool.isRequired,
  onCloseDropdown: PropTypes.func.isRequired,
  onDownloadReport: PropTypes.func.isRequired,
<<<<<<< HEAD
  test: PropTypes.object.isRequired,
  scores: PropTypes.array
};

const mapStateToProps = createStructuredSelector({
  scores: makeSelectActiveTestScores()
});

const mapDispatchToProps = dispatch => ({
  onSetScores: scores => dispatch(setActiveTestScores(scores))
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CompletedTestCard);
=======
  onDetailTest: PropTypes.func.isRequired,
  test: PropTypes.object.isRequired
};

export default CompletedTestCard;
>>>>>>> 5648d67a1ffd519eaa27202bf67e210bab1c7b50
