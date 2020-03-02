import React from "react";
import PropTypes from "prop-types";
import AnswerSheetNavBar from "./components/AnswerSheetNavBar";
import ReadingPage from "./components/ReadingPage";
import WritingPage from "./components/WritingPage";
import MathNoCalcPage from "./components/MathNoCalcPage";
import MathCalculatorPage from "./components/MathCalculatorPage";
import EssayPage from "./components/EssayPage";

class DetailTestAnswerSheetComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: "reading",
      isOpened: false,
      testScoreDetails: {
        reading: {
          totalCorrect: "39",
          totalPossible: "59",
          passageType: {
            science: "11",
            informationalGraphicPassage: "12",
            historySocialScience: "13",
            USWorldLiterature: "14",
            pairedPassages: "12"
          },
          questionType: {
            citingTextualEvidence: {
              citeTextAsEvidence: "12",
              authorsIntentionAndMethod: "12",
              supportOrRefute: "12"
            },
            readingClosely: {
              detailQuestion: "12",
              supportRefuteAClaim: "13"
            }
          }
        },
        mathCalculator: {
          sampleAnswers: [
            {
              id: 11,
              topic: "topic1",
              problem: 1,
              answer: "A",
              studentChoice: "B",
              correct: false,
              status: "E",
              flagged: true,
              reviewed: true,
              tutorNotes: "work and study hard"
            },
            {
              id: 12,
              topic: "topic2",
              problem: 1,
              answer: "B",
              studentChoice: "B",
              correct: true,
              status: "E",
              flagged: false,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 13,
              topic: "topic3",
              problem: 1,
              answer: "C",
              studentChoice: "",
              correct: false,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 14,
              topic: "topic4",
              problem: 1,
              answer: "D",
              studentChoice: "A",
              correct: true,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 21,
              topic: "topic1",
              problem: 1,
              answer: "A",
              studentChoice: "B",
              correct: false,
              status: "E",
              flagged: true,
              reviewed: true,
              tutorNotes: "work and study hard"
            },
            {
              id: 22,
              topic: "topic2",
              problem: 1,
              answer: "B",
              studentChoice: "B",
              correct: true,
              status: "E",
              flagged: false,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 23,
              topic: "topic3",
              problem: 1,
              answer: "C",
              studentChoice: "",
              correct: false,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 24,
              topic: "topic4",
              problem: 1,
              answer: "D",
              studentChoice: "A",
              correct: true,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 25,
              topic: "topic4",
              problem: 1,
              answer: "D",
              studentChoice: "",
              correct: true,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            }
          ]
        },
        mathNoCalc: {
          sampleAnswers: [
            {
              id: 11,
              topic: "topic1",
              problem: 1,
              answer: "B",
              studentChoice: "A",
              correct: false,
              status: "E",
              flagged: false,
              reviewed: true,
              tutorNotes: "work and study hard"
            },
            {
              id: 12,
              topic: "topic2",
              problem: 1,
              answer: "A",
              studentChoice: "",
              correct: true,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 13,
              topic: "topic3",
              problem: 1,
              answer: "C",
              studentChoice: "",
              correct: false,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 14,
              topic: "topic4",
              problem: 1,
              answer: "D",
              studentChoice: "D",
              correct: true,
              status: "E",
              flagged: false,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 21,
              topic: "topic1",
              problem: 1,
              answer: "A",
              studentChoice: "B",
              correct: false,
              status: "E",
              flagged: true,
              reviewed: true,
              tutorNotes: "work and study hard"
            },
            {
              id: 22,
              topic: "topic2",
              problem: 1,
              answer: "B",
              studentChoice: "B",
              correct: true,
              status: "E",
              flagged: false,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 23,
              topic: "topic3",
              problem: 1,
              answer: "C",
              studentChoice: "",
              correct: false,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 24,
              topic: "topic4",
              problem: 1,
              answer: "D",
              studentChoice: "A",
              correct: true,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 25,
              topic: "topic4",
              problem: 1,
              answer: "D",
              studentChoice: "",
              correct: true,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            }
          ]
        },
        writing: {
          sampleAnswers: [
            {
              id: 11,
              numeric: false,
              topic: "writing",
              problem: 1,
              answer: "B",
              studentChoice: "",
              correct: false,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 12,
              numeric: false,
              topic: "writing",
              problem: 2,
              answer: "D",
              studentChoice: "D",
              correct: true,
              status: "M",
              flagged: false,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 13,
              numeric: true,
              topic: "writing",
              problem: 3,
              answer: 1492,
              studentChoice: 1492,
              correct: true,
              status: "M",
              flagged: false,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 14,
              numeric: true,
              topic: "writing",
              problem: 4,
              answer: 1.25,
              studentChoice: 5.71,
              correct: false,
              status: "E  ",
              flagged: false,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 21,
              numeric: false,

              topic: "topic1",
              problem: 1,
              answer: "A",
              studentChoice: "B",
              correct: false,
              status: "E",
              flagged: true,
              reviewed: true,
              tutorNotes: "work and study hard"
            },
            {
              id: 22,
              numeric: false,
              topic: "topic2",
              problem: 1,
              answer: "B",
              studentChoice: "B",
              correct: true,
              status: "E",
              flagged: false,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 23,
              numeric: false,
              topic: "topic3",
              problem: 1,
              answer: "C",
              studentChoice: "",
              correct: false,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 24,
              numeric: false,
              topic: "topic4",
              problem: 1,
              answer: "D",
              studentChoice: "A",
              correct: true,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            },
            {
              id: 25,
              numeric: false,
              opic: "topic4",
              problem: 1,
              answer: "D",
              studentChoice: "",
              correct: true,
              status: "E",
              flagged: true,
              reviewed: false,
              tutorNotes: "work and study hard"
            }
          ]
        }
      }
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  getComponentImages = () => {
    return new Promise(resolve => {
      let imgDataList = [];
      const componentRefs = [
        { id: "readingAnswerSheetImg", state: "reading" },
        { id: "writingAnswerSheetImg", state: "writing" },
        { id: "mathNoCalcAnswerSheetImg", state: "math (no calc)" },
        { id: "mathCalcAnswerSheetImg", state: "math (calculator)" }
      ];
      const getImgListPromise = componentRefs.reduce((accumulatorPromise, item) => {
          return accumulatorPromise
            .then(async () => {
              const result = await this.getData(item);
              return imgDataList.push(result);
            })
            .catch(console.error);
        },
        Promise.resolve()
      );
      getImgListPromise.then(() => {
        resolve(imgDataList);
      });
    });
  };

  getData = item => {
    return new Promise(resolve => {
      this.setState({ activeSlide: item.state }, async () => {
        const currentImg = await this.onHandleTargetImage(item.id)
        resolve(currentImg);
      });
    });
  };

  onHandleTargetImage = async currentRef => {
    const { getTargetImage } = this.props;
    const currentImg = await getTargetImage(document.getElementById(currentRef))
    return currentImg;
  };

  onSetActiveSlide = activeSlide => this.setState({ activeSlide });

  renderCurrentSlide = () => {
    const {
      testScoreDetails: {
        mathNoCalc,
        mathCalculator,
        writing: { sampleAnswers }
      },
      activeSlide
    } = this.state;
    if (activeSlide === "reading") {
      return <ReadingPage mathNoCalc={mathNoCalc} />;
    }
    if (activeSlide === "writing") {
      return <WritingPage sampleAnswers={sampleAnswers} />;
    }
    if (activeSlide === "math (no calc)") {
      return <MathNoCalcPage mathNoCalc={mathNoCalc} />;
    }
    if (activeSlide === "math (calculator)") {
      return <MathCalculatorPage mathCalculator={mathCalculator} />;
    }
    if (activeSlide === "essay") {
      return <EssayPage />;
    }
    return null;
  };

  render() {
    const { activeSlide } = this.state;
    return (
      <div className="card-main-full card">
        <div className="slick-tabs-gallery">
          <AnswerSheetNavBar
            activeSlide={activeSlide}
            onSetActiveSlide={this.onSetActiveSlide}
          />
        </div>
        <div className="card-content">
          <div className="main-slick">{this.renderCurrentSlide()}</div>
        </div>
      </div>
    );
  }
}

DetailTestAnswerSheetComplete.propTypes = {
  getTargetImage: PropTypes.func.isRequired
};

export default DetailTestAnswerSheetComplete;
