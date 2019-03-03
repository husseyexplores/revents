import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cuid from 'cuid'
import { Grid, Button } from 'semantic-ui-react'

import { createEvent, updateEvent, deleteEvent } from '../eventActions'

import EventList from '../EventList/EventList'
import EventForm from '../EventForm/EventForm'

class EventDashBoard extends Component {
  state = {
    isFormOpen: false,
    selectedEvent: null,
  }

  handleOpenForm = () => {
    this.setState({
      isFormOpen: true,
      selectedEvent: null,
    })
  }

  handleCloseForm = () => {
    this.setState({
      isFormOpen: false,
    })
  }

  handleOpenEvent = eventToOpen => (/* e */) => {
    this.setState({
      // spreading `eventToOpen` because it is a reference of the `satte.events` event
      // without spreading, it updates the `state.events` array too.
      selectedEvent: { ...eventToOpen },
      isFormOpen: true,
    })
  }

  handleCreateEvent = newEvent => {
    newEvent.id = cuid()
    newEvent.hostPhotoURL = '/assets/user.png'

    const { createEvent } = this.props
    createEvent(newEvent)
  }

  handleUpdateEvent = updatedEvent => {
    const { updateEvent } = this.props
    updateEvent(updatedEvent)

    this.setState({
      isFormOpen: false,
      selectedEvent: null,
    })
  }

  handleDeleteEvent = eventId => () => {
    const { deleteEvent } = this.props
    deleteEvent(eventId)

    this.setState({
      isFormOpen: false,
    })
  }

  render() {
    const { events } = this.props
    const { isFormOpen, selectedEvent } = this.state

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            handleOpenEvent={this.handleOpenEvent}
            handleDeleteEvent={this.handleDeleteEvent}
            events={events}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <Button
            content="Create Event"
            positive
            onClick={this.handleOpenForm}
          />
          {isFormOpen && (
            <EventForm
              selectedEvent={selectedEvent}
              handleCloseForm={this.handleCloseForm}
              handleCreateEvent={this.handleCreateEvent}
              handleUpdateEvent={this.handleUpdateEvent}
            />
          )}
        </Grid.Column>
      </Grid>
    )
  }
}

EventDashBoard.propTypes = {
  events: PropTypes.array,
  createEvent: PropTypes.func.isRequired,
  updateEvent: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
}

EventDashBoard.defaultProps = {}

function mapState(state) {
  return {
    events: state.events,
  }
}

function mapDispatch(dispatch) {
  return {
    createEvent: event => dispatch(createEvent(event)),
    updateEvent: event => dispatch(updateEvent(event)),
    deleteEvent: eventId => dispatch(deleteEvent(eventId)),
  }
}

export default connect(
  mapState,
  mapDispatch
)(EventDashBoard)
