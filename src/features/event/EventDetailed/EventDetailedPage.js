import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase'
import formatDate from 'date-fns/format'
import { Grid } from 'semantic-ui-react'

import { objectToArray, createDataTree } from '../../../app/common/util/helpers'

import EventDetailedHeader from './EventDetailedHeader'
import EventDetailedInfo from './EventDetailedInfo'
import EventDetailedChat from './EventDetailedChat'
import EventDetailedSidebar from './EventDetailedSidebar'
import Spinner from '../../../app/common/components/loaders/Spinner'

import { goingToEvent, cancelGoingToEvent } from '../../user/userActions'
import { addEventComment } from '../eventActions'

function EventDetailedPage({
  addEventComment,
  goingToEvent,
  cancelGoingToEvent,
  auth,
  event,
  firestore,
  eventChat,
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
          formattedDateTime={formattedDateTime}
          venue={venue}
          lat={lat}
          lng={lng}
        />
        <EventDetailedChat
          addEventComment={addEventComment}
          eventId={event.id}
          eventChat={eventChat}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar attendees={attendees} />
      </Grid.Column>
    </Grid>
  )
}

EventDetailedPage.propTypes = {
  eventChat: PropTypes.array.isRequired,
  goingToEvent: PropTypes.func.isRequired,
  addEventComment: PropTypes.func.isRequired,
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

EventDetailedPage.defaultProps = {
  eventChat: [],
}

function mapState(state) {
  let event = {}

  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = { ...state.firestore.ordered.events[0] }
    event.attendees = event.attendees && objectToArray(event.attendees)
    // convert firebase timestamp to date
    event.date = event.date.toDate()
  }

  let eventChat = state.firebase.data.event_chat
  eventChat =
    (event.id && !isEmpty(eventChat) && objectToArray(eventChat[event.id])) ||
    []
  const chatTree = createDataTree(eventChat)
  return {
    event,
    auth: state.firebase.auth,
    eventChat: chatTree,
  }
}

const mapDispatch = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
}

export default compose(
  firebaseConnect(({ match }) => [`event_chat/${match.params.id}`]),
  withFirestore,
  connect(
    mapState,
    mapDispatch
  )
)(EventDetailedPage)
