import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Segment, Form, Button } from 'semantic-ui-react'

class EventForm extends Component {
  state = {
    event: {
      title: '',
      date: '',
      city: '',
      venue: '',
      hostedBy: '',
    },
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
    const { handleCreateEvent } = this.props
    handleCreateEvent(this.state.event)
  }

  render() {
    const { handleCloseForm, handleCreateEvent } = this.props
    const { title } = this.state.event

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
              name="date"
              type="date"
              placeholder="Event Date"
              onChange={this.onInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>City</label>
            <input
              name="city"
              placeholder="City event is taking place"
              onChange={this.onInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Venue</label>
            <input
              name="venue"
              placeholder="Enter the Venue of the event"
              onChange={this.onInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Hosted By</label>
            <input
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
}

EventForm.defaultProps = {}

export default EventForm
