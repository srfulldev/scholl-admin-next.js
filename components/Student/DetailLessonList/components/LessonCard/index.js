import React from 'react';
import PropTypes from 'prop-types';

import { getProblemCompletionStatusColor, getLessonActivityStatus } from '../../utils';

class LessonCard extends React.Component {
  handleDropdownClick = (event) => {
    const { onSetDropdown, onCloseDropdown, dropdownIsOpen, index } = this.props;
    event.preventDefault();
    if (dropdownIsOpen) {
      return onCloseDropdown();
    }
    return onSetDropdown(index);
  }

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

  renderProblemCount = (assigned, totalProblems, solvedProblems) => {
    if (assigned) {
      return (
        <span className="chart-value chart-value-column" style={getProblemCompletionStatusColor(solvedProblems, totalProblems)}>
          <span className="chart-count" data-count-up data-start-val="0" data-end-val="4" data-duration="1"><span className="text-large">{solvedProblems}</span></span>
          <span className="text-small">out of</span> <span className="text-large">{totalProblems}</span>
        </span>
      )
    }
    return (
      <span className="chart-value chart-value-column" style={{ backgroundColor: '#666' }}>
        <span data-count-up data-start-val="0" data-end-val="0" data-duration="1">
          <span className="text-large">{totalProblems}</span>
          <span className="text-small">problems</span>
        </span>
      </span>
    )
  }

  renderProblemCompletionStatus = (dueTime, completed, completionDate, completionTime, completedLate, availableDate, dueDate, overdue, assigned) => {
    if (completed) {
      return (
        <React.Fragment>
          <p>Completed <time dateTime="2018-11-18T20:43">{completionDate} at {completionTime}</time>
            {completedLate && (<span className="status status-late"> (late)</span>)}
          </p>
        </React.Fragment>
      )
    }
    if (availableDate) {
      return (
        <React.Fragment>
          <p>Available <time dateTime="2018-12-13">{availableDate}</time></p>
          <p><time dateTime="2018-12-17">(due {dueDate})</time></p>
        </React.Fragment>
      )
    }
    if (overdue) {
      return (
        <React.Fragment>
          <strong className="text-large" style={{ color: '#c1272d' }}>Overdue</strong>
        </React.Fragment>
      )
    }
    if (!availableDate && dueDate) {
      return (
        <React.Fragment>
          <p>Due <time dateTime="2018-12-15">{dueDate}</time></p>
        </React.Fragment>
      )
    }
    if (!assigned && !dueDate) {
      return (
        <React.Fragment>
          <p>Not Assigned</p>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <strong className="text-large" style={{ color: '#006837' }}>Due Today at {dueTime}</strong>
      </React.Fragment>
    )
  }

  renderAlerts = (alerts) => {
    if (alerts) {
      return (
        <div className="right-col col s3">
          <span className="badge-rounded badge red darken-2 white-text"><b className="badge-text">{alerts.length}</b> <i className="icon-flag"></i></span>
        </div>
      )
    }
    return (
      <div className="right-col col s3">&nbsp;</div>
    )
  }

  render() {
    const { lesson: { subject, unitNumber, lessonName, assigned, alerts, lessonType,
      totalProblems, solvedProblems = '', passage, dueDate, dueTime, completed, availableDate,
      completionDate, completionTime, completedLate, overdue }, dropdownIsOpen, dropdownIndex,
      onToggleDetailModalOpen, index } = this.props;
    
    return (
      <div className="card-main-col col s12 m8 l7 xl5">
       <div className={getLessonActivityStatus(assigned, dueDate)}>
         <div className="card-panel" style={{ backgroundColor: '#666', color: '#fff' }}>
           <div className="card-panel-row row">
             <div className="icon-col col s1">
               <i className={this.renderLessonIcon(subject)}></i>
             </div>
             <div className="col s9">
               <div className="card-panel-text center-align">
                 <div className="text-small">{subject} Unit {unitNumber}</div>
                 <div className="text-large">{lessonName}</div>
               </div>
             </div>
             <div className="col s1 right-align">
               <div className="row icons-row">
                 <div className="dropdown-block col">
                   <a
                     href='#'
                     data-target='dropdown01'
                     className='dropdown-trigger btn'
                     onClick={this.handleDropdownClick}
                   >
                    <i className="material-icons dots-icon">more_vert</i>
                   </a>
                   <If condition={dropdownIsOpen && dropdownIndex === index}>
                     <ul
                       id='dropdown01'
                       className='dropdown-content dropdown-wide'
                       style={{ display: 'block', transformOrigin: '0px 0px 0px', opacity: '1', transform: 'scaleX(1) scaleY(1)' }}
                     >
                       <li>
                         <a href="#" onClick={() => onToggleDetailModalOpen(index)} className="modal-trigger link-block">Edit</a>
                       </li>
                       <li><a href="#">Clone</a></li>
                       <li><a href="#">Show Owner</a></li>
                       <li><a href="#">Delete</a></li>
                     </ul>
                   </If>
                 </div>
               </div>
             </div>
           </div>
         </div>
         <div className="card-content">
           <div className="card-top-row row mb-0">
             <div className="left-col col s3">
               <span className="meta-num">p.{passage}</span>
             </div>
             <div className="center-col col s6 center-align">
               <span className="meta-name">({lessonType})</span>
             </div>
             {this.renderAlerts(alerts)}
           </div>
           <div className="chart-container chart-container-xlarge">
             <div className="chart-holder">
               <span className="svg-curved-bar" data-values='{"from": 0, "to": 0, "current": 0}' data-duration="1">
                 <svg  width="207px" height="207px" viewBox="0 0 207 207" preserveAspectRatio="xMidYMid meet">
                   <path fill="none" style={{ strokeWidth: '42', stroke: '#eaeaea' }} d="M 26.909645526174018 134.16215259197702 A 82.5 82.5 0 1 1 180.09035447382598 134.16215259197702"></path>
                   <path data-dinamic fill="none" style={{ strokeWidth: '42', stroke: '#62b771' }} d="M 26.909645526174018 134.16215259197702 A 82.5 82.5 0 0 1 26.909645526174018 134.16215259197702"></path>
                 </svg>
               </span>
               {this.renderProblemCount(assigned, totalProblems, solvedProblems)}
             </div>
           </div>
           <div className="card-footer-row center-align">
             <div className="card-footer-holder">
               {this.renderProblemCompletionStatus(dueTime, completed, completionDate, completionTime, completedLate, availableDate, dueDate, overdue, assigned)}
             </div>
           </div>
         </div>
       </div>
      </div>
    );
  }
}

LessonCard.propTypes = {
  dropdownIndex: PropTypes.number,
  index: PropTypes.number.isRequired,
  lesson: PropTypes.object.isRequired,
  onSetDropdown: PropTypes.func.isRequired,
  dropdownIsOpen: PropTypes.bool.isRequired,
  onCloseDropdown: PropTypes.func.isRequired,
  onToggleDetailModalOpen: PropTypes.func.isRequired,
};

export default LessonCard;
