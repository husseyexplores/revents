import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'

import EventDetailedHeader from './EventDetailedHeader'
import EventDetailedInfo from './EventDetailedInfo'
import EventDetailedChat from './EventDetailedChat'
import EventDetailedSidebar from './EventDetailedSidebar'

function EventDetailedPage({ event }) {
  const {
    title,
    date,
    category,
    hostedBy,
    // hostPhotoURL,
    attendees,
    // city,
    venue,
    description,
    id,
  } = event

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader
          title={title}
          category={category}
          date={date}
          hostedBy={hostedBy}
          id={id}
        />
        <EventDetailedInfo
          description={description}
          date={date}
          venue={venue}
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
  event: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    city: PropTypes.string,
    venue: PropTypes.string,
    hostedBy: PropTypes.string,
    hostPhotoURL: PropTypes.string,
    attendees: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
}

EventDetailedPage.defaultProps = {}

function mapState(state, ownProps) {
  const currentEventId = ownProps.match.params.id
  let event = {}

  if (currentEventId && state.events.length > 0) {
    event = state.events.filter(evt => evt.id === currentEventId)[0]
  }

  return {
    event,
  }
}

export default connect(
  mapState,
  null
)(EventDetailedPage)
