import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cuid from 'cuid'
import { Segment, Form, Button } from 'semantic-ui-react'

import { createEvent, updateEvent, deleteEvent } from '../eventActions'

class EventForm extends Component {
  state = {
    event: { ...this.props.event },
  }

  onInputChange = e => {
    const newEvent = this.state.event
    newEvent[e.target.name] = e.target.value
    this.setState({
      event: newEvent,
    })
  }

  onSubmit = e => {
    e.preventDefault()
    const { event } = this.state
    const { createEvent, updateEvent } = this.props

    if (event.id) {
      updateEvent(event)
      this.props.history.push(`/event/${event.id}`)
    } else {
      createEvent({ ...event, id: cuid(), hostPhotoURL: '/assets/user.png' })
      this.props.history.push(`/events`)
    }
  }

  render() {
    const { title, date, city, venue, hostedBy } = this.state.event

    return (
      <Segment>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Event Title</label>
            <input
              name="title"
              placeholder="Event Title"
              value={title}
              onChange={this.onInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Event Date</label>
            <input
              value={date}
              name="date"
              type="date"
              placeholder="Event Date"
              onChange={this.onInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>City</label>
            <input
              value={city}
              name="city"
              placeholder="City event is taking place"
              onChange={this.onInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Venue</label>
            <input
              value={venue}
              name="venue"
              placeholder="Enter the Venue of the event"
              onChange={this.onInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Hosted By</label>
            <input
              value={hostedBy}
              name="hostedBy"
              placeholder="Enter the name of person hosting"
              onChange={this.onInputChange}
            />
          </Form.Field>
          <Button positive type="submit">
            Submit
          </Button>
          <Button type="button" onClick={this.props.history.goBack}>
            Cancel
          </Button>
        </Form>
      </Segment>
    )
  }
}

EventForm.propTypes = {
  history: PropTypes.object,
  closeForm: PropTypes.func,
  createEvent: PropTypes.func,
  updateEvent: PropTypes.func,
  selectedEvent: PropTypes.object,
  event: PropTypes.object,
}

EventForm.defaultProps = {}

function mapState(state, ownProps) {
  const eventId = ownProps.match.params.id

  const initailFormValues = {
    title: '',
    date: '',
    city: '',
    venue: '',
    hostedBy: '',
  }

  if (eventId && state.events.length) {
    return {
      event: state.events.filter(evt => evt.id === eventId)[0],
    }
  }

  // default case
  return {
    event: { ...initailFormValues },
  }
}

const mapDispatch = {
  createEvent,
  updateEvent,
  deleteEvent,
}

export default connect(
  mapState,
  mapDispatch
)(EventForm)
