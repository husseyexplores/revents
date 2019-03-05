/* global google */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import {
  combineValidators,
  composeValidators,
  isRequired,
  hasLengthGreaterThan,
} from 'revalidate'
import formatDate from 'date-fns/format'
import cuid from 'cuid'
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react'

import { createEvent, updateEvent, deleteEvent } from '../eventActions'

import {
  TextInput,
  TextArea,
  SelectInput,
  DateInput,
  PlaceInput,
} from '../../../app/common/components/form/'

const categoryOptions = [
  { key: 'drinks', text: 'Drinks', value: 'drinks' },
  { key: 'culture', text: 'Culture', value: 'culture' },
  { key: 'film', text: 'Film', value: 'film' },
  { key: 'food', text: 'Food', value: 'food' },
  { key: 'music', text: 'Music', value: 'music' },
  { key: 'travel', text: 'Travel', value: 'travel' },
]

class EventForm extends Component {
  state = {
    cityLatLng: this.props.initialValues.venueLatLng || {},
    cityError: null,
    venueLatLng: this.props.initialValues.venueLatLng || {},
    venueError: null,
  }

  handleCancel = () => {
    const { history, match } = this.props
    const { id: eventId } = match.params
    const { url } = match

    if (url.includes('/manage/')) {
      // if we are editing a form, go back to the form detailed page
      history.push(`/event/${eventId}`)
    } else {
      // otherwise go back to events
      history.push(`/events`)
    }
  }

  onSubmit = values => {
    const { initialValues, createEvent, updateEvent } = this.props
    const { cityLatLng, venueLatLng } = this.state
    const formattedDate = formatDate(values.date)

    if (initialValues.id) {
      updateEvent({ ...values, cityLatLng, venueLatLng, date: formattedDate })
      this.props.history.push(`/event/${initialValues.id}`)
    } else {
      createEvent({
        ...values,
        cityLatLng,
        venueLatLng,
        date: formattedDate,
        id: cuid(),
        hostPhotoURL: '/assets/user.png',
        hostedBy: 'Hassan',
      })
      this.props.history.push(`/events`)
    }
  }

  render() {
    // method from reduxForm
    const { handleSubmit, invalid, submitting, pristine } = this.props
    const { cityLatLng, cityError } = this.state

    let cityLocation

    if (cityLatLng.lat && !cityError && window.google) {
      cityLocation = new google.maps.LatLng(cityLatLng)
    }

    return (
      <Grid>
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content="Event Details" />
            <Form onSubmit={handleSubmit(this.onSubmit)}>
              <Field
                name="title"
                component={TextInput}
                type="text"
                placeholder="Give your event a name"
              />
              <Field
                name="category"
                component={SelectInput}
                options={categoryOptions}
                placeholder="What is your event about?"
              />
              <Field
                name="description"
                component={TextArea}
                type="text"
                rows={3}
                placeholder="Tell us about your event"
              />
              <Header sub color="teal" content="Event Location Details" />
              <Field
                name="city"
                component={PlaceInput}
                searchOptions={{
                  types: ['(cities)'],
                }}
                onCoords={cityLatLng =>
                  this.setState({ cityLatLng, cityError: null })
                }
                onError={cityError => this.setState({ cityError })}
                type="text"
                placeholder="Event city"
              />
              <Field
                disabled={!cityLatLng.lat}
                name="venue"
                component={PlaceInput}
                onCoords={venueLatLng =>
                  this.setState({ venueLatLng, venueError: null })
                }
                onError={venueError => this.setState({ venueError })}
                searchOptions={{
                  location: cityLocation,
                  radius: 1000,
                  types: ['establishment'],
                }}
                type="text"
                placeholder="Event venue"
              />
              <Field
                name="date"
                component={DateInput}
                dateFormat="yyyy-MM-dd HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                placeholder="Data and Time of event"
              />
              <Button
                positive
                type="submit"
                disabled={invalid || submitting || pristine}
              >
                Submit
              </Button>
              <Button type="button" onClick={this.handleCancel}>
                Cancel
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

EventForm.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  createEvent: PropTypes.func.isRequired,
  updateEvent: PropTypes.func.isRequired,
}

EventForm.defaultProps = {}

function mapState(state, ownProps) {
  const eventId = ownProps.match.params.id

  if (eventId && state.events.length) {
    const eventArr = state.events.filter(evt => evt.id === eventId)

    if (eventArr.length === 0 && ownProps.match.url.includes('/manage/')) {
      ownProps.history.replace('/events/')
      return
    }

    return {
      initialValues: eventArr[0],
    }
  }

  // default case
  return {
    initialValues: {},
  }
}

const mapDispatch = {
  createEvent,
  updateEvent,
  deleteEvent,
}

const validate = combineValidators({
  title: isRequired({ message: 'Event title is required' }),
  category: isRequired({
    message: 'Please provide a category title is required',
  }),
  description: composeValidators(
    isRequired({ message: 'Please enter a description' }),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 character',
    })
  )(),
  city: isRequired('Event city'),
  venue: isRequired('Event venue'),
  date: isRequired('Event date'),
})

const withReduxForm = reduxForm({
  form: 'eventForm',
  enableReinitialize: true,
  validate,
})(EventForm)

export default connect(
  mapState,
  mapDispatch
)(withReduxForm)
