import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withFirestore } from 'react-redux-firebase'
import { toastr } from 'react-redux-toastr'
import formatDate from 'date-fns/format'
import { Grid } from 'semantic-ui-react'

import { objectToArray } from '../../../app/common/util/helpers'

import EventDetailedHeader from './EventDetailedHeader'
import EventDetailedInfo from './EventDetailedInfo'
import EventDetailedChat from './EventDetailedChat'
import EventDetailedSidebar from './EventDetailedSidebar'
import Spinner from '../../../app/common/components/loaders/Spinner'

import { goingToEvent, cancelGoingToEvent } from '../../user/userActions'
import { openModal } from '../../modals/modalActions'
import { useFirebaseSubscription } from '../../../app/hooks'

import { addEventComment } from '../eventActions'

function EventDetailedPage({
  history,
  isLoading,
  openModal,
  addEventComment,
  goingToEvent,
  isRequesting,
  cancelGoingToEvent,
  auth,
  event,
  firestore,
  match: { params },
}) {
  const [initialLoading, setInitialLoading] = useState(true)
  useEffect(() => {
    setInitialLoading(false)
  }, [])

  // subsribe to event in firestore
  useEffect(() => {
    const eventId = params.id
    ;(async () => {
      const event = await firestore.get(`events/${eventId}`)
      if (!event.exists) {
        toastr.error('Not found!', 'This is not the event you are looking for')
        history.push('/not-found')
      }

      await firestore.setListener(`events/${eventId}`)
    })()

    // unsubscribe on unmount
    return () => {
      firestore.unsetListener(`events/${eventId}`)
    }
  }, [firestore, history, params.id])

  // subscribe to chat in firebase
  const eventChat = useFirebaseSubscription(`event_chat/${params.id}`)

  if (
    !event ||
    !event.createdAt ||
    isRequesting[`events/${params.id}`] ||
    initialLoading
  ) {
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

  const formattedDate = formatDate(date, 'dddd, Do MMMM')
  const formattedTime = formatDate(date, 'h:mm A')
  const formattedDateTime = `${formattedDate} at ${formattedTime}`

  const formattedEvent = {
    ...event,
    formattedDate,
    formattedTime,
    formattedDateTime,
  }

  const isHost = hostUid === auth.uid
  const isGoing =
    attendees && attendees.some(attendee => attendee.id === auth.uid)
  const authenticated = auth.isLoaded && !auth.isEmpty

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader
          event={formattedEvent}
          isHost={isHost}
          isGoing={isGoing}
          goingToEvent={goingToEvent}
          cancelGoingToEvent={cancelGoingToEvent}
          isLoading={isLoading}
          authenticated={authenticated}
          openModal={openModal}
        />
        <EventDetailedInfo
          description={description}
          formattedDateTime={formattedDateTime}
          venue={venue}
          lat={lat}
          lng={lng}
        />
        {authenticated && (
          <EventDetailedChat
            addEventComment={addEventComment}
            eventId={event.id}
            eventChat={eventChat}
          />
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar attendees={attendees} />
      </Grid.Column>
    </Grid>
  )
}

EventDetailedPage.propTypes = {
  openModal: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isRequesting: PropTypes.object.isRequired,
  goingToEvent: PropTypes.func.isRequired,
  addEventComment: PropTypes.func.isRequired,
  cancelGoingToEvent: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

function mapState(state) {
  let event = {}

  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = { ...state.firestore.ordered.events[0] }
    event.attendees =
      event.attendees &&
      objectToArray(event.attendees).sort(
        (a, b) => a.joinDate.seconds - b.joinDate.seconds
      )
    // convert firebase timestamp to date
    event.date = event.date.toDate()
  }

  return {
    event,
    auth: state.firebase.auth,
    isLoading: state.async.isLoading,
    isRequesting: state.firestore.status.requesting || {},
  }
}

const mapDispatch = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
  openModal,
}

export default compose(
  withFirestore,
  connect(
    mapState,
    mapDispatch
  )
)(EventDetailedPage)
