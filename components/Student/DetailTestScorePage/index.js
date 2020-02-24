import React from "react";
import PropTypes from "prop-types";
import TotalScoreCard from "./components/TotalScoreCard";
import SectionScoreCard from "./components/SectionScoreCard";
import TestScoreCard from "./components/TestScoreCard";
import EssayScoresCard from "./components/EssayScoresCard";
import CrossTestScoresCard from "./components/CrossTestScoresCard";
import SubScoresCard from "./components/SubscoresCard";

const DetailTestScorePage = ({
  userScoreRef,
  sectionScoreRef,
  crossTestScoreRef,
  essayScoreRef,
  subScoreRef,
  test: {
    subjectScores,
    totalScore,
    totalPossible,
    sectionScores,
    essayScores,
    crossTestScores,
    subScores
  }
}) => (
  <div className="container">
    <div className="cards-section">
      <div className="d-flex-content same-height justify-center row mb-0">
        <TotalScoreCard
          totalScore={totalScore}
          totalPossible={totalPossible}
          userScoreRef={userScoreRef}
        />
        <SectionScoreCard
          sectionScores={sectionScores}
          sectionScoreRef={sectionScoreRef}
        />
      </div>
      <div className="d-flex-content same-height justify-center row mb-0">
        <TestScoreCard subjectScores={subjectScores} />
        <EssayScoresCard
          essayScores={essayScores}
          essayScoreRef={essayScoreRef}
        />
      </div>
      <div
        className="d-flex-content justify-center row mb-0"
      >
        <CrossTestScoresCard crossTestScores={crossTestScores} crossTestScoreRef = {crossTestScoreRef} />
        <SubScoresCard subScores={subScores} subScoreRef={subScoreRef} />
      </div>
    </div>
  </div>
);

DetailTestScorePage.propTypes = {
  test: PropTypes.object.isRequired
};

export default DetailTestScorePage;
