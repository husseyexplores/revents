import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import { Grid } from 'semantic-ui-react'

import Spinner from '../../../app/common/components/loaders/Spinner'
import EventList from '../EventList/'
import EventActicity from '../EventActivity'

function EventDashBoard({ events }) {
  if (!isLoaded(events) || isEmpty(events)) {
    return <Spinner content="Loading..." size="big" dim />
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventList events={events} />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventActicity />
      </Grid.Column>
    </Grid>
  )
}

EventDashBoard.propTypes = {
  events: PropTypes.array,
}

EventDashBoard.defaultProps = {}

function mapState(state) {
  return {
    events: state.firestore.ordered.events,
  }
}

export default compose(
  connect(
    mapState,
    null
  ),
  firestoreConnect([{ collection: 'events' }])
)(EventDashBoard)
