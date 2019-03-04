import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'

import { deleteEvent } from '../eventActions'

import EventList from '../EventList/EventList'

class EventDashBoard extends Component {
  handleDeleteEvent = eventId => () => {
    const { deleteEvent } = this.props
    deleteEvent(eventId)

    this.setState({
      isFormOpen: false,
    })
  }

  render() {
    const { events } = this.props

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            handleDeleteEvent={this.handleDeleteEvent}
            events={events}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <h2>Event Activity</h2>
        </Grid.Column>
      </Grid>
    )
  }
}

EventDashBoard.propTypes = {
  events: PropTypes.array,
  deleteEvent: PropTypes.func.isRequired,
}

EventDashBoard.defaultProps = {}

function mapState(state) {
  return {
    events: state.events,
  }
}

const mapDispatch = {
  deleteEvent,
}

export default connect(
  mapState,
  mapDispatch
)(EventDashBoard)
