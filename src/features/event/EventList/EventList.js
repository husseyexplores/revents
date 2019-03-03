import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

import EventListItem from './EventListItem'

class EventList extends Component {
  renderEventListItems() {
    const { events, handleOpenEvent, handleDeleteEvent } = this.props

    if (events && events.length) {
      return events.map(event => (
        <EventListItem
          key={event.id}
          event={event}
          handleOpenEvent={handleOpenEvent}
          handleDeleteEvent={handleDeleteEvent}
        />
      ))
    }

    return (
      <Loader active inline="centered">
        Loading
      </Loader>
    )
  }

  render() {
    return (
      <div>
        <h3>Event List</h3>
        {this.renderEventListItems()}
      </div>
    )
  }
}

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  handleOpenEvent: PropTypes.func.isRequired,
  handleDeleteEvent: PropTypes.func.isRequired,
}

EventList.defaultProps = {}

export default EventList
