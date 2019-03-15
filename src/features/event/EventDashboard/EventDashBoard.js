import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'

import Spinner from '../../../app/common/components/loaders/Spinner'
import EventList from '../EventList/'
import EventActicity from '../EventActivity'

import { getEventsForDashboard } from '../eventActions'

function EventDashBoard({
  events,
  isLoading,
  hasMoreEvents,
  getEventsForDashboard,
}) {
  const [loadingInitial, setLoadingInitial] = useState(true)

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
        <EventList
          events={events}
          getMoreEvents={getMoreEvents}
          hasMoreEvents={hasMoreEvents}
          isLoading={isLoading}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventActicity />
      </Grid.Column>
      <Grid.Column width={10}>
        {isLoading && <Spinner />}
        {!hasMoreEvents && <p>No more events.</p>}
      </Grid.Column>
    </Grid>
  )
}

EventDashBoard.propTypes = {
  events: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getEventsForDashboard: PropTypes.func.isRequired,
  hasMoreEvents: PropTypes.bool.isRequired,
}

EventDashBoard.defaultProps = {}

function mapState(state) {
  return {
    events: state.events.dashboard,
    isLoading: state.async.isLoading,
    hasMoreEvents: state.variables.dbHasMoreEvents || false,
  }
}

const mapDispatch = {
  getEventsForDashboard,
}

export default compose(
  connect(
    mapState,
    mapDispatch
  )
)(EventDashBoard)
