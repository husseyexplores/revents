import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { Grid } from 'semantic-ui-react'

import { deleteEvent } from '../eventActions'

import Spinner from '../../../app/common/components/loaders/Spinner'
import EventList from '../EventList/'
import EventActicity from '../EventActivity'

class EventDashBoard extends Component {
  handleDeleteEvent = eventId => () => {
    const { deleteEvent } = this.props
    deleteEvent(eventId)

    this.setState({
      isFormOpen: false,
    })
  }

  render() {
    const { events, isLoading } = this.props
    if (isLoading) {
      return <Spinner content="Loading..." size="big" dim />
    }

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            handleDeleteEvent={this.handleDeleteEvent}
            events={events}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActicity />
        </Grid.Column>
      </Grid>
    )
  }
}

EventDashBoard.propTypes = {
  events: PropTypes.array,
  deleteEvent: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
}

EventDashBoard.defaultProps = {}

function mapState(state) {
  return {
    events: state.firestore.ordered.events,
    isLoading: state.async.isLoading,
  }
}

const mapDispatch = {
  deleteEvent,
}

const withFirestore = firestoreConnect([{ collection: 'events' }])(
  EventDashBoard
)

const withFirebase = firebaseConnect()(withFirestore)

export default connect(
  mapState,
  mapDispatch
)(withFirebase)
