import React from 'react'
import PropTypes from 'prop-types'

import EventListItem from './EventListItem'

function EventList({ events }) {
  if (!events || !events.length) {
    return <h4>There are no events to display.</h4>
  }

  if (events && events.length > 0) {
    return events.map(evt => <EventListItem key={evt.id} event={evt} />)
  }

  return null
}

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
}

EventList.defaultProps = {}

export default EventList
