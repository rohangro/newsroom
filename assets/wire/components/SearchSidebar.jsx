import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { gettext } from 'utils';

import {
    toggleNavigation,
    toggleFilter,
    resetFilter,
} from 'wire/actions';

import TopicsTab from './TopicsTab';
import FiltersTab from './FiltersTab';
import NavigationTab from './NavigationTab';

class SearchSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.tabs = [
            {label: gettext('Navigation'), content: NavigationTab},
            {label: gettext('Filters'), content: FiltersTab},
        ];
        this.state = {active: this.tabs[0]};
        this.toggleNavigation = this.toggleNavigation.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
    }

    toggleNavigation(event, navigation) {
        event.preventDefault();
        this.props.dispatch(toggleNavigation(navigation));
    }

    toggleFilter(event, field, value, single) {
        event.preventDefault();
        this.props.dispatch(toggleFilter(field, value, single));
    }

    resetFilter(event) {
        event.preventDefault();
        this.props.dispatch(resetFilter());
    }

    render() {
        return (
            <div className='wire-column__nav__items'>
                <ul className='nav justify-content-center' id='pills-tab' role='tablist'>
                    {this.tabs.map((tab) => (
                        <li className='wire-column__nav__tab nav-item' key={tab.label}>
                            <a className={`nav-link ${this.state.active === tab && 'active'}`}
                                role='tab'
                                href=''
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({active: tab});
                                }}>{tab.label}</a>
                        </li>
                    ))}
                </ul>
                <div className='tab-content' key={gettext('Navigation')}>
                    <div className={classNames('tab-pane', 'fade', {'show active': this.state.active === this.tabs[0]})} role='tabpanel'>
                        <NavigationTab
                            navigations={this.props.navigations}
                            activeNavigation={this.props.activeNavigation}
                            toggleNavigation={this.toggleNavigation}
                        />
                        {this.props.topics.length && <span className='wire-column__nav__divider'></span>}
                        <TopicsTab
                            dispatch={this.props.dispatch}
                            topics={this.props.topics}
                            newItemsByTopic={this.props.newItemsByTopic}
                            activeTopic={this.props.activeTopic}
                        />
                    </div>
                </div>
                <div className='tab-content' key={gettext('Filters')}>
                    <div className={classNames('tab-pane', 'fade', {'show active': this.state.active === this.tabs[1]})} role='tabpanel'>
                        <FiltersTab
                            activeFilter={this.props.activeFilter}
                            aggregations={this.props.aggregations}
                            toggleFilter={this.toggleFilter}
                            resetFilter={this.resetFilter}
                            dispatch={this.props.dispatch}
                            createdFilter={this.props.createdFilter}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

SearchSidebar.propTypes = {
    activeQuery: PropTypes.string,
    topics: PropTypes.array.isRequired,
    bookmarkedItems: PropTypes.array.isRequired,
    itemsById: PropTypes.object.isRequired,
    aggregations: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    navigations: PropTypes.array.isRequired,
    activeNavigation: PropTypes.string,
    activeFilter: PropTypes.object,
    newItemsByTopic: PropTypes.object,
    createdFilter: PropTypes.object.isRequired,
    activeTopic: PropTypes.object,
};

const mapStateToProps = (state) => ({
    bookmarkedItems: state.bookmarkedItems || [],
    itemsById: state.itemsById,
    activeFilter: state.wire.activeFilter,
    aggregations: state.aggregations,
    newItemsByTopic: state.newItemsByTopic,
    createdFilter: state.wire.createdFilter,
});

export default connect(mapStateToProps)(SearchSidebar);
