import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withFirestore } from 'react-redux-firebase'
import formatDate from 'date-fns/format'
import { Grid } from 'semantic-ui-react'

import { objectToArray } from '../../../app/common/util/helpers'

import EventDetailedHeader from './EventDetailedHeader'
import EventDetailedInfo from './EventDetailedInfo'
import EventDetailedChat from './EventDetailedChat'
import EventDetailedSidebar from './EventDetailedSidebar'
import Spinner from '../../../app/common/components/loaders/Spinner'

import { goingToEvent, cancelGoingToEvent } from '../../user/userActions'

function EventDetailedPage({
  goingToEvent,
  cancelGoingToEvent,
  auth,
  event,
  firestore,
  match: { params },
}) {
  useEffect(() => {
    const eventId = params.id
    ;(async () => {
      await firestore.setListener(`events/${eventId}`)
    })()

    // unsubscribe on unmount
    return () => {
      firestore.unsetListener(`events/${eventId}`)
    }
  }, [firestore, params.id])

  /*
  useEffect(() => {
    ;(async () => {
      const fetchedEvent = await firestore.get(`events/${params.id}`)
      if (!fetchedEvent.exists) {
        toastr.error('Sorry!', 'Event not found')
        history.push('/events')
      }
    })()
  }, [firestore, history, params.id])
  */

  if (!event || !event.title) {
    return <Spinner content="Loading..." dim size="big" />
  }

  const {
    date,
    attendees,
    venue,
    description,
    // cancelled,
    hostUid,
    venueLatLng: { lat, lng },
  } = event

  const formattedDate = formatDate(date.toDate(), 'dddd, Do MMMM')
  const formattedTime = formatDate(date.toDate(), 'h:mm A')
  const formattedDateTime = `${formattedDate} at ${formattedTime}`

  const formattedEvent = {
    ...event,
    date: formattedDate,
    time: formattedTime,
    dateTime: formattedDateTime,
  }

  const isHost = hostUid === auth.uid
  const isGoing =
    attendees && attendees.some(attendee => attendee.id === auth.uid)

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader
          event={formattedEvent}
          isHost={isHost}
          isGoing={isGoing}
          goingToEvent={goingToEvent}
          cancelGoingToEvent={cancelGoingToEvent}
        />
        <EventDetailedInfo
          description={description}
          date={formattedDateTime}
          venue={venue}
          lat={lat}
          lng={lng}
        />
        <EventDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar attendees={attendees} />
      </Grid.Column>
    </Grid>
  )
}

EventDetailedPage.propTypes = {
  goingToEvent: PropTypes.func.isRequired,
  cancelGoingToEvent: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

EventDetailedPage.defaultProps = {}

function mapState(state) {
  let event = {}

  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = { ...state.firestore.ordered.events[0] }
    event.attendees = event.attendees && objectToArray(event.attendees)
  }

  return {
    event,
    auth: state.firebase.auth,
  }
}

const mapDispatch = {
  goingToEvent,
  cancelGoingToEvent,
}

export default compose(
  withFirestore,
  connect(
    mapState,
    mapDispatch
  )
)(EventDetailedPage)
