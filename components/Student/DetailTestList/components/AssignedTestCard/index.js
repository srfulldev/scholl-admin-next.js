import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { fetchStudentTestScoreApi } from "../../../index/api";
class AssignedTestCard extends React.Component {
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

  componentDidMount = async () => {
    const scores = await this.getScoresByStudentTest(this.props.test);
    scores.map(score => {
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

  getScoresByStudentTest = async test => {
    const { student_test_id } = test;
    const { formattedTestScores } = await fetchStudentTestScoreApi(student_test_id);
    console.log("formattedTestScores:",formattedTestScores)
    return formattedTestScores.scores;
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
      test: { test_name, test_description, dueDate, completion_date, test_id },
      onEnterAnswers,
      handleTestSettingModalOpen
    } = this.props;
    const formattedDueDate = moment(dueDate).format("MM/DD/YY");
    const formattedCompletedDate = moment(completion_date).format("MM/DD/YY");
    return (
      <React.Fragment>
        <div
          className="card-full-width card-scored card"
          style={{ margin: "10px", minWidth: "580px" }}
        >
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
                      <div className="col s6 m6 right-align">
                        <div className="row icons-row" style={{ marginBottom: "10px" }}>
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
                                  <a href="#" onClick={handleTestSettingModalOpen}>
                                    Edit Test Settings
                                  </a>
                                </li>
                                <li>
                                  <a href="#" onClick={() => onEnterAnswers(test_id)}>
                                    Edit/Enter Answers
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
                    <div className="row">
                      <div className="col s12 m8">
                        <ul className="info-list info-list-gray  assigned">
                          <li>
                            <span className="list-status">
                              <span className="ico-mark" />
                              <span className="status-text">Assigned {formattedCompletedDate}</span>
                            </span>
                          </li>
                          <li>
                            <span className="list-date">
                              <i className="icon-calendar" />
                              <span className="date">Due {formattedDueDate}</span>
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

AssignedTestCard.propTypes = {
  dropdownIndex: PropTypes.number,
  onSetDropdown: PropTypes.func.isRequired,
  dropdownIsOpen: PropTypes.bool.isRequired,
  onCloseDropdown: PropTypes.func.isRequired,
  onDownloadReport: PropTypes.func.isRequired,
  test: PropTypes.object.isRequired
};

export default AssignedTestCard;
