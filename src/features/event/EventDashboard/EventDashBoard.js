import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import cuid from 'cuid'
import { Grid, Button } from 'semantic-ui-react'

import EventList from '../EventList/EventList'
import EventForm from '../EventForm/EventForm'

const EVENTS_DUMMY_DATA = [
  {
    id: '1',
    title: 'Trip to Tower of London',
    date: '2018-03-27',
    category: 'culture',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
    city: 'London, UK',
    venue: "Tower of London, St Katharine's & Wapping, London",
    hostedBy: 'Bob',
    hostPhotoURL: 'https://randomuser.me/api/portraits/men/20.jpg',
    attendees: [
      {
        id: 'a',
        name: 'Bob',
        photoURL: 'https://randomuser.me/api/portraits/men/20.jpg',
      },
      {
        id: 'b',
        name: 'Tom',
        photoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
      },
    ],
  },
  {
    id: '2',
    title: 'Trip to Punch and Judy Pub',
    date: '2018-03-28',
    category: 'drinks',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
    city: 'London, UK',
    venue: 'Punch & Judy, Henrietta Street, London, UK',
    hostedBy: 'Tom',
    hostPhotoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
    attendees: [
      {
        id: 'b',
        name: 'Tom',
        photoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
      },
      {
        id: 'a',
        name: 'Bob',
        photoURL: 'https://randomuser.me/api/portraits/men/20.jpg',
      },
    ],
  },
]

class EventDashBoard extends Component {
  state = {
    events: EVENTS_DUMMY_DATA,
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

  handleUpdateEvent = updatedEvent => {
    this.setState({
      events: this.state.events.map(event => {
        if (event.id === updatedEvent.id) {
          return Object.assign({}, updatedEvent)
        }
        return event
      }),
      isFormOpen: false,
      selectedEvent: null,
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
    this.setState(state => ({
      events: [...state.events, newEvent],
    }))
  }

  handleDeleteEvent = eventId => () => {
    this.setState(state => ({
      events: state.events.filter(event => event.id !== eventId),
      isFormOpen: false,
    }))
  }

  render() {
    const { events, isFormOpen, selectedEvent } = this.state

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

EventDashBoard.propTypes = {}

EventDashBoard.defaultProps = {}

export default EventDashBoard
