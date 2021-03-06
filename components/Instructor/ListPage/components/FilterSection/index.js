/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Dropdown from '../../../../FormComponents/Dropdown';
import getValueFromState from '../../../../utils/getValueFromState';
import locationOptions from '../../../../utils/locationOptions';
import sortOptions from '../../../../utils/sortOptions';
import { searchInstructors } from '../../../index/actions';

class FilterSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      location: {},
      sort: {},
    };
  }

  // This function does two things - first, it changes the filter state regardless of the field it's coming from
  // If either location or sort filters are changed, we dispatch the appropriate action in ListPage to ensure the rendered instructors are filtered/sorted appropriately
  // eslint-disable-next-line consistent-return
  handleFilterChange = (event, name) => {
    const { onSetFilteredLocationState, onUnsetFilteredLocationState, onSetSort } = this.props;
    const value = event.target ? event.target.value : event;
    const updatedState = update(this.state, {
      $merge: { [name]: value },
    });
    this.setState(updatedState);
    this.setState(updatedState, () => {
      const { onSearchInstructors } = this.props;
      // eslint-disable-next-line no-unused-vars
      const { name, location, sort } = this.state;
      const filters = {
        name,
        // location,
        // sort,
      };
      onSearchInstructors(filters);
    });
    if (name === 'location') {
      if (event === '') {
        return onUnsetFilteredLocationState();
      }
      return onSetFilteredLocationState(event);
    } else if (name === 'sort') {
      return onSetSort(event);
    }
  }

  // Strips the entered name of any spaces and capitalizing and fires off the ListPage event that filters the instructors
  submitNameFilter = () => {
    const { onSetFilteredState, onUnsetFilteredState } = this.props;
    const { name } = this.state;
    if (name === '') {
      onUnsetFilteredState();
    }
    const transformedName = name.replace(/\s/g, "").toLowerCase();
    onSetFilteredState(transformedName);
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { name, location, sort } = this.state;
    return (
      <div className="filter-inputs-holder">
        <div className="row mb-0">
          <div className="col s12 m4 l3">
            <div className="search-field input-field">
              <input
                type="search"
                id="name_search"
                className="input-control validate"
                name="name"
                value={name}
                onChange={(event) => this.handleFilterChange(event, 'name')}
              />
              <button
                type="submit"
                className="search-button"
                onClick={this.submitNameFilter}
              >
                <i className="icon-search"></i>
              </button>
              <label className={name.length ? 'label active' : 'label'} htmlFor="name_search">Search</label>
            </div>
          </div>
          <div className="col s12 m4 l3">
            <div className="input-field">
              <Dropdown
                value={getValueFromState(location, locationOptions)}
                onChange={(event) => this.handleFilterChange(event, 'location')}
                options={locationOptions}
                label="Location"
                stateKey="location"
                dropdownKey="location"
              />
            </div>
          </div>
          <div className="col s12 m4 l3">
            <div className="input-field">
              <Dropdown
                value={getValueFromState(sort, sortOptions)}
                onChange={(event) => this.handleFilterChange(event, 'sort')}
                options={sortOptions}
                label="Sort"
                stateKey="sort"
                dropdownKey="sort"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FilterSection.propTypes = {
  onSetSort: PropTypes.func.isRequired,
  onSetFilteredState: PropTypes.func.isRequired,
  onUnsetFilteredState: PropTypes.func.isRequired,
  onSetFilteredLocationState: PropTypes.func.isRequired,
  onUnsetFilteredLocationState: PropTypes.func.isRequired,
  onSearchInstructors: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onSearchInstructors: (filters) => dispatch(searchInstructors(filters)),
});

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(FilterSection);
