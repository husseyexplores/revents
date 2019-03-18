import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import formatDate from 'date-fns/format'
import { Grid } from 'semantic-ui-react'

import { createDataTree } from '../../../app/common/util/helpers'

import EventDetailedHeader from './EventDetailedHeader'
import EventDetailedInfo from './EventDetailedInfo'
import EventDetailedChat from './EventDetailedChat'
import EventDetailedSidebar from './EventDetailedSidebar'
import Spinner from '../../../app/common/components/loaders/Spinner'

import { goingToEvent, cancelGoingToEvent } from '../../user/userActions'
import { openModal } from '../../modals/modalActions'
import {
  useFirebaseSubscription,
  useFirestoreSubscription,
} from '../../../app/hooks'

import { addEventComment } from '../eventActions'

function EventDetailedPage({
  isLoading,
  openModal,
  addEventComment,
  goingToEvent,
  cancelGoingToEvent,
  auth,
  match: { params },
}) {
  // subscribe to our Event in firestore
  let [event, isSubscribed, errorSubscribing] = useFirestoreSubscription(
    `collection(events).doc(${params.id})`,
    { normalize: ['attendees'] }
  )
  event = event[0] // we need the first object

  // subscribe to chat in firebase
  const [eventChatArr] = useFirebaseSubscription(`event_chat/${params.id}`)
  const eventChat =
    eventChatArr && Array.isArray(eventChatArr)
      ? createDataTree(eventChatArr)
      : []

  if (errorSubscribing) {
    toastr.error('Oops!', 'This is probably not the event you are looking for')

    return <Redirect to="/not-found" />
  }

  // check if event is loaded
  if (!isSubscribed) {
    return <Spinner content="Loading..." dim size="big" />
  }

  const {
    date,
    attendees,
    venue,
    description,
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
  history: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  goingToEvent: PropTypes.func.isRequired,
  addEventComment: PropTypes.func.isRequired,
  cancelGoingToEvent: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

function mapState(state) {
  return {
    auth: state.firebase.auth,
    isLoading: state.async.isLoading,
  }
}

const mapDispatch = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
  openModal,
}

export default connect(
  mapState,
  mapDispatch
)(EventDetailedPage)
