import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { Grid } from 'semantic-ui-react'

import Spinner from '../../../app/common/components/loaders/Spinner'
import EventList from '../EventList/'
import EventActivity from '../EventActivity'

import { getEventsForDashboard } from '../eventActions'

function EventDashBoard({
  activities,
  events,
  isLoading,
  hasMoreEvents,
  getEventsForDashboard,
}) {
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [contextRef, setContextRef] = useState({})

  function handleContextRef(contextRef) {
    setContextRef(contextRef)
  }

  useEffect(() => {
    async function getInitialEvents() {
      await getEventsForDashboard()
      setLoadingInitial(false)
    }
    getInitialEvents()
  }, [getEventsForDashboard])

  async function getMoreEvents() {
    await getEventsForDashboard()
  }

  if (loadingInitial) {
    return <Spinner content="Loading..." size="big" dim />
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <div ref={handleContextRef}>
          <EventList
            events={events}
            getMoreEvents={getMoreEvents}
            hasMoreEvents={hasMoreEvents}
            isLoading={isLoading}
          />
        </div>
      </Grid.Column>
      <Grid.Column width={6}>
        <EventActivity activities={activities} contextRef={contextRef} />
      </Grid.Column>
      <Grid.Column width={10}>
        {isLoading && <Spinner />}
        {!hasMoreEvents && <p>No more events.</p>}
      </Grid.Column>
    </Grid>
  )
}

EventDashBoard.propTypes = {
  activities: PropTypes.array,
  events: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getEventsForDashboard: PropTypes.func.isRequired,
  hasMoreEvents: PropTypes.bool.isRequired,
}

EventDashBoard.defaultProps = {}

function mapState(state) {
  // normalize date from firebase timestamp
  const activities =
    (state.firestore.ordered.activity &&
      state.firestore.ordered.activity.map(act => ({
        ...act,
        timestamp: act.timestamp.toDate(),
      }))) ||
    []

  return {
    activities: activities,
    events: state.events.dashboard,
    isLoading: state.async.isLoading,
    hasMoreEvents: state.variables.dbHasMoreEvents || false,
  }
}

const mapDispatch = {
  getEventsForDashboard,
}

export default compose(
  firestoreConnect([
    { collection: 'activity', orderBy: ['timestamp', 'desc'], limit: 5 },
  ]),
  connect(
    mapState,
    mapDispatch
  )
)(EventDashBoard)
