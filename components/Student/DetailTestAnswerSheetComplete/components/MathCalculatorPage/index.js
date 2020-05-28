import React from 'react';
import PropTypes from 'prop-types';
import AnswerRow from '../WritingPage/components/AnswerRow';

class MathCalculatorPage extends React.Component {
  mapAnswers = () => {
    const { testSection: { problems: problemsSection }, testSection } = this.props;
    return (
      problemsSection.problems &&
      problemsSection.problems.map(problem =>
        <AnswerRow key={problem.test_problem_id} testSection={testSection} problem={problem} onAddStudentAnswerToTest={this.props.onAddStudentAnswerToTest} />,
      )
    );
  };

  render() {
    return (
      <div className="slide" id="mathCalcAnswerSheetImg">
        <div className="row" style={{ columns: '3 auto', marginLeft: '10px', marginRight: '10px' }}>
          <ol className="answers-list" style={{ marginBottom: '40px' }}>
            {this.mapAnswers()}
          </ol>
        </div>
      </div>
    );
  }
}

MathCalculatorPage.propTypes = {
  testSection: PropTypes.object,
};
export default MathCalculatorPage;
