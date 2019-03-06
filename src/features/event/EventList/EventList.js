import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EventListItem from './EventListItem'

class EventList extends Component {
  renderEventListItems() {
    const { events, handleDeleteEvent } = this.props

    if (!events || !events.length) {
      return <h4>There are no events to display.</h4>
    }

    if (events && events.length > 0) {
      return events.map(evt => (
        <EventListItem
          key={evt.id}
          event={evt}
          handleDeleteEvent={handleDeleteEvent}
        />
      ))
    }

    return null
  }

  render() {
    return <div>{this.renderEventListItems()}</div>
  }
}

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  handleDeleteEvent: PropTypes.func,
}

EventList.defaultProps = {}

export default EventList
