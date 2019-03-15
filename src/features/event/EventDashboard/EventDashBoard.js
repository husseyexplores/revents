import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  firestoreConnect,
  firebaseConnect,
  isLoaded,
  isEmpty,
} from 'react-redux-firebase'
import { Grid } from 'semantic-ui-react'

import { deleteEvent } from '../eventActions'

import Spinner from '../../../app/common/components/loaders/Spinner'
import EventList from '../EventList/'
import EventActicity from '../EventActivity'

function EventDashBoard({ events, deleteEvent }) {
  const handleDeleteEvent = eventId => () => {
    deleteEvent(eventId)
  }

  if (!isLoaded(events) || isEmpty(events)) {
    return <Spinner content="Loading..." size="big" dim />
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventList handleDeleteEvent={handleDeleteEvent} events={events} />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventActicity />
      </Grid.Column>
    </Grid>
  )
}

EventDashBoard.propTypes = {
  events: PropTypes.array,
  deleteEvent: PropTypes.func.isRequired,
}

EventDashBoard.defaultProps = {}

function mapState(state) {
  return {
    events: state.firestore.ordered.events,
  }
}

const mapDispatch = {
  deleteEvent,
}

export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  firebaseConnect(),
  firestoreConnect([{ collection: 'events' }])
)(EventDashBoard)
