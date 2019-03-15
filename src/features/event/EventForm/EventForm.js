/* global google */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { reduxForm, Field } from 'redux-form'
import { withFirestore } from 'react-redux-firebase'
import {
  combineValidators,
  composeValidators,
  isRequired,
  hasLengthGreaterThan,
} from 'revalidate'
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react'

import { createEvent, updateEvent, eventCancelToggle } from '../eventActions'

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

function EventForm({
  event, // same as initialValues
  firestore,
  history,
  match,
  handleSubmit,
  invalid,
  submitting,
  pristine,
  createEvent,
  updateEvent,
  eventCancelToggle,
}) {
  const [cityLatLng, setCityLatLng] = useState(event.cityLatLng || {})
  const [cityError, setCityError] = useState(null)
  const [venueLatLng, setVenueLatLng] = useState(event.venueLatLng || {})
  const [venueError, setVenueError] = useState(null) // eslint-disable-line no-unused-vars

  useEffect(() => {
    let isSubscribed = false
    const eventId = match.params.id

    // subscribe
    ;(async () => {
      if (match.url.includes('/manage/') && eventId) {
        isSubscribed = true
        await firestore.setListener(`events/${eventId}`)
      }
    })()

    // unsubscribe on unmount
    if (isSubscribed) {
      return () => {
        firestore.unsetListener(`events/${eventId}`)
      }
    }
  }, [firestore, match.params, match.url])

  function handleCancelForm() {
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

  function onSubmit(values) {
    // we get ALL values, modified or unmodified

    if (event.id) {
      updateEvent({ ...values, cityLatLng, venueLatLng })
      history.push(`/event/${event.id}`)
    } else {
      createEvent({
        ...values,
        cityLatLng,
        venueLatLng,
      })
      history.push(`/events`)
    }
  }

  // toggle cancel event
  function handleCancelEvent(isCancelled, eventId) {
    return () => eventCancelToggle(isCancelled, eventId)
  }

  let cityLocation

  if (cityLatLng.lat && !cityError && window.google) {
    cityLocation = new google.maps.LatLng(cityLatLng)
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment>
          <Header sub color="teal" content="Event Details" />
          <Form onSubmit={handleSubmit(onSubmit)} error>
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
              onCoords={cityLatLng => {
                setCityLatLng(cityLatLng)
                setCityError(cityError)
              }}
              onError={cityError => setCityError(cityError)}
              type="text"
              placeholder="Event city"
            />
            <Field
              disabled={!cityLatLng.lat}
              name="venue"
              component={PlaceInput}
              onCoords={venueLatLng => {
                setVenueLatLng(venueLatLng)
                setVenueError(null)
              }}
              onError={venueError => setVenueError(venueError)}
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
              showYearDropdown
            />
            <Button
              positive
              type="submit"
              disabled={invalid || submitting || pristine}
            >
              Submit
            </Button>
            <Button type="button" onClick={handleCancelForm}>
              Cancel
            </Button>
            <Button
              type="button"
              color={event.cancelled ? 'green' : 'red'}
              floated="right"
              onClick={handleCancelEvent(!event.cancelled, event.id)}
            >
              {event.cancelled ? 'Reactivate Event' : 'Cancel Event'}
            </Button>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

EventForm.propTypes = {
  firestore: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  createEvent: PropTypes.func.isRequired,
  updateEvent: PropTypes.func.isRequired,
  eventCancelToggle: PropTypes.func.isRequired,
  invalid: PropTypes.bool,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
}

EventForm.defaultProps = {}

function mapState(state, props) {
  let event = {}

  if (
    props.match.url.includes('/manage/') &&
    state.firestore.ordered.events &&
    state.firestore.ordered.events[0]
  ) {
    event = state.firestore.ordered.events[0]
  }

  return {
    initialValues: { ...event },
    event: { ...event },
  }
}

const mapDispatch = {
  createEvent,
  updateEvent,
  eventCancelToggle,
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

export default compose(
  withFirestore,
  connect(
    mapState,
    mapDispatch
  ),
  reduxForm({
    form: 'eventForm',
    enableReinitialize: true,
    validate,
  })
)(EventForm)
