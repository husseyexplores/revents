import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

import EventListItem from './EventListItem'

class EventList extends Component {
  renderEventListItems() {
    const { events } = this.props

    if (events && events.length) {
      return events.map(event => <EventListItem key={event.id} event={event} />)
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
}

EventList.defaultProps = {}

export default EventList
