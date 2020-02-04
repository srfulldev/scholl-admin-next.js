import React from "react";
import update from "immutability-helper";
import PropTypes from "prop-types";

class ProblemRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      problemCells: [
        {
          id: 0,
          label: "A",
          selected: false
        },
        {
          id: 1,
          label: "B",
          selected: false
        },
        {
          id: 2,
          label: "C",
          selected: false
        },
        {
          id: 3,
          label: "D",
          selected: false
        }
      ]
    };
  }

  handleClickBadge = index => {
    if (this.state.selected === false) {
      const {
        onAddStudentAnswerToTest,
        problem: { test_problem_id }
      } = this.props;
      const currentBadge = this.state.problemCells[index];
      const updatedProblemCells = update(this.state.problemCells, {
        [index]: { selected: { $set: !currentBadge.selected } }
      });
      this.setState({ problemCells: updatedProblemCells,selected:true });
      const { label } = this.state.problemCells[index];
      onAddStudentAnswerToTest(test_problem_id, label);
    }
  };

  render() {
    const { problemCells } = this.state;
    return (
      <li className="answers-list-holder">
        {/* we are not using input box for now */}
        {/* {this.props.problem.answerInput === true ? (<input type="text" className="answer-input" tabIndex={0} />):(*/}
        <ul className="answer-list">
          {problemCells.map((cell, index) => (
            <li
              style={{ cursor: "pointer" }}
              onClick={() => this.handleClickBadge(index)}
              key={index}
            >
              <span
                className="badge-circle badge-circle-bordered"
                style={{
                  color: cell.selected ? "#fff" : "",
                  borderColor: cell.selected ? "#19b4e9" : "",
                  backgroundColor: cell.selected ? "#19b4e9" : ""
                }}
              >
                {cell.label}
              </span>
            </li>
          ))}
        </ul>
        {/* )} */}
      </li>
    );
  }
}

ProblemRow.propTypes = {
  problem: PropTypes.object.isRequired,
  onAddStudentAnswerToTest: PropTypes.func.isRequired
};

export default ProblemRow;