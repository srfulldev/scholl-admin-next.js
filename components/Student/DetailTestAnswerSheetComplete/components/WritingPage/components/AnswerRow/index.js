import React from "react";
import PropTypes from "prop-types";
import BubbleGroup from "../Bubble";
import FreeResponse from '../FreeResponse';
import DropDownMenuOptions from '../DropDownOptions';

class AnswerRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      status: '',
    };
  }

  componentDidMount = () => {
    if (this.props.problem.flag) {
      const { problem: { flag: { status } } } = this.props;
      this.setState({
        status,
      });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { problem: { flag: { status: nextPropsStatus } } } = nextProps;
    if (nextPropsStatus !== this.state.status) {
      this.setState({
        status: nextPropsStatus,
      });
    }
  }

  onOpenQuestionModal = () => this.setState({ open: !this.state.open });
  onCloseQuestionModal = () => this.setState({ open: false });

  mapNumberBubbles = () => {
    const {
      problem: { student_answer, correct_answer },
      problem,
      testSection,
    } = this.props;
    if (student_answer === correct_answer) {
      return (
        <>
          <li>
            <FreeResponse problem={problem} testSection={testSection} answerStatus={{ complete: true, isCorrect: true }} />
          </li>
          <li key={student_answer}>
            <span
              className="badge badge-rounded badge-rounded-bordered"
              style={{ color: "#fff", borderColor: "#32955c", backgroundColor: "#3eb777" }}
            >
              {student_answer}
            </span>
          </li>
        </>
      );
    }
    return (
      <React.Fragment>
        <li key={student_answer}>
          <FreeResponse problem={problem} testSection={testSection} answerStatus={{ complete: true, isCorrect: false }} />
        </li>
        <li key={correct_answer}>
          <span
            className="badge badge-rounded badge-rounded-bordered"
            style={{
              color: "#32955c",
              borderColor: "#32955c",
              backgroundColor: "#fff",
              width: "100%",
            }}
          >
            {correct_answer}
          </span>
        </li>
      </React.Fragment>
    );
  };

  getAnswerType = problem => {
    const { correct_answer } = problem;
    if (!parseFloat(correct_answer) && correct_answer !== '0.0') {
      return null;
    }
    return correct_answer;
  };

  render() {
    const { problem, onAddStudentAnswerToTest, testSection } = this.props;
    const { open, status } = this.state;
    return (
      <React.Fragment>
        <li
          className="answers-list-holder"
          key={problem.test_problem_id}
          style={{ marginRight: "15px" }}
        >
          <div className="answer-row row mb-0">
            <div className="col col-120">
              <ul className="answer-list">
                <Choose>
                  <When condition={this.getAnswerType(problem)}>{this.mapNumberBubbles()}</When>
                  <When condition={problem.type === "fill_in_the_blank"}>
                    <FreeResponse
                      problem={problem}
                      testSection={testSection}
                      answerStatus={{ complete: false }}
                    />
                  </When>
                  <Otherwise>
                    <BubbleGroup
                      id={problem.id}
                      testSection={testSection}
                      onAddStudentAnswerToTest={onAddStudentAnswerToTest}
                      problem={problem}
                    />
                  </Otherwise>
                </Choose>
              </ul>
            </div>
            <div className="col col-30">
              {/* <span className="status-info">E</span> */}
            </div>
            <div className="col col-auto">
              <If condition={status === "FLAGGED"}>
                <span className="status-answer" style={{ color: "#c0272d" }}>
                  <i className="icon-flag"></i>
                  <b className="status-text">Review</b>
                </span>
              </If>
              <If condition={status === "REVIEWED"}>
                <span className="status-answer status-disabled" style={{ color: "#c0272d" }}>
                  <i className="icon-flag"></i>
                  <b className="status-text">Reviewed</b>
                </span>
              </If>
            </div>
            <div className="dropdown-block col col-35">
              <a
                className="dropdown-trigger"
                href="#"
                data-target="dropdown01"
                onClick={() => this.onOpenQuestionModal()}
              >
                <i className="material-icons dots-icon">more_vert</i>
              </a>
              <DropDownMenuOptions
                open={open}
                onOpenQuestionModal={this.onOpenQuestionModal}
                onCloseQuestionModal={this.onCloseQuestionModal}
                question={problem}
                studentTestId={this.props.testSection.student_test_id}
              />
            </div>
          </div>
        </li>
      </React.Fragment>
    );
  }
}

AnswerRow.propTypes = {
  problem: PropTypes.object,
};

export default AnswerRow;
