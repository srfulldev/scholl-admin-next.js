import React from 'react';
import PropTypes from 'prop-types';
import statusColorMap from '../../../../DetailWorksheetPage/utils/statusColorMap';

class LessonListItem extends React.Component {
  // eslint-disable-next-line consistent-return
  renderLessonIcon = (subject) => {
    switch (subject) {
      case 'Reading':
        return 'icon-books';
      case 'Writing':
        return 'icon-hands';
      case 'Math':
        return 'icon-calculator';
      default:
        break;
    }
  }

  render() {
    const { checkedLessons, selectAll, handleCheckbox, index, lesson, lesson: { id, name: lessonName, status, assigned, score, scoreStatus, reviewedAlerts, subject, unit, passage, timeEstimate, problems, lessonType, flags } } = this.props;
    return (
      <div className="card list-table-row" key={id} style={{ opacity: assigned ? 0.5 : 1 }}>
        <div className="list-table-cell icon-cell">
          <label htmlFor={index}>
            <input
              type="checkbox"
              id={index}
              checked={!selectAll ? checkedLessons.indexOf(lesson) > -1 : true}
              onChange={() => handleCheckbox(lesson)}
              className="filled-in"
            />
            <span><b>&nbsp;</b></span>
          </label>
        </div>
        <div className="list-table-cell icon-cell">
          <span className="block-icon">
            <i className={this.renderLessonIcon(subject)}></i>
          </span>
        </div>
        <div className="list-table-cell name-cell" style={{ width: '140px' }}>
          <div className="card-panel-text truncate">
            <div className="text-large truncate" id="lessonName">{unit} {lessonName}</div>
          </div>
        </div>
        <div className="list-table-cell graph-cell" style={{ marginLeft: '50px' }}>
          {scoreStatus && (
            <span className={`chart-bar ${statusColorMap[scoreStatus]} white-text`}>{Math.floor(`${score / problems * 100}`)}%</span>
          )}
        </div>
        <div className="list-table-cell status-cell" >
          <Choose>
            <When condition={scoreStatus !== ""}>
              <span className={`badge badge-rounded-md ${statusColorMap[scoreStatus]} white-text`}>{scoreStatus}</span>
            </When>
            <Otherwise>
              <span className={`badge badge-rounded-md ${statusColorMap[status]} white-text`}>{status}</span>
            </Otherwise>
          </Choose>
        </div>
        <div className="list-table-cell type-cell" style={{ marginLeft: '10px' }}>{subject}</div>
        <div className="list-table-cell type-cell">p. {passage}</div>
        <div className="list-table-cell date-cell">{timeEstimate}</div>
        <div className="list-table-cell date-cell"style={{ paddingLeft: '50px' }}>{problems}</div>

        <div className="list-table-cell name-cell">
          <div className="card-panel-text truncate">
            <div className="text-large truncate" style={{ paddingLeft: '70px' }}>{lessonType}</div>
          </div>
        </div>
        {/* <div className="list-table-cell graph-cell">
          {reviewedAlerts.length > 0 && (
            <span className="badge-rounded-xs badge grey darken-1 white-text"><b className="badge-text">{reviewedAlerts.length}</b> <i className="icon-flag"></i></span>
          )}
        </div>
        <div className="list-table-cell flags-cell">
          {flags.length > 0 && (
            <span className="badge-rounded-xs badge red darken-2 white-text"><b className="badge-text">{flags.length}</b> <i className="icon-flag"></i></span>
          )}
        </div> */}
      </div>
    );
  }
}

LessonListItem.propTypes = {
  index: PropTypes.number.isRequired,
  lesson: PropTypes.object.isRequired,
  selectAll: PropTypes.bool.isRequired,
  handleCheckbox: PropTypes.func.isRequired,
  checkedLessons: PropTypes.array.isRequired,
};

export default LessonListItem;
