import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Segment, Form, Button } from 'semantic-ui-react'

const emptyEvent = {
  title: '',
  date: '',
  city: '',
  venue: '',
  hostedBy: '',
}

class EventForm extends Component {
  state = {
    event: this.props.selectedEvent ? this.props.selectedEvent : emptyEvent,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // if the new form is empty,
    // then reset the form
    if (nextProps.selectedEvent === null) {
      return {
        event: emptyEvent,
      }
    }
    // if the previous form data is different then new form data,
    // then update the form
    if (prevState.event.id !== nextProps.selectedEvent.id) {
      return {
        event: nextProps.selectedEvent,
      }
    }
    return null
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
    const { handleCreateEvent, handleUpdateEvent } = this.props

    if (event.id) {
      handleUpdateEvent(event)
    } else {
      handleCreateEvent(event)
    }
  }

  render() {
    const { handleCloseForm } = this.props
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
          <Button type="button" onClick={handleCloseForm}>
            Cancel
          </Button>
        </Form>
      </Segment>
    )
  }
}

EventForm.propTypes = {
  handleCloseForm: PropTypes.func.isRequired,
  handleCreateEvent: PropTypes.func.isRequired,
  handleUpdateEvent: PropTypes.func,
  selectedEvent: PropTypes.object,
}

EventForm.defaultProps = {}

export default EventForm
