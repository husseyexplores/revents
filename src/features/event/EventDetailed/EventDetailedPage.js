import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { format as formatDate } from 'date-fns'
import { Grid } from 'semantic-ui-react'

import EventDetailedHeader from './EventDetailedHeader'
import EventDetailedInfo from './EventDetailedInfo'
import EventDetailedChat from './EventDetailedChat'
import EventDetailedSidebar from './EventDetailedSidebar'

import { eventPropTypes } from '../eventPropTypes'

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

  const formattedDate = formatDate(date, 'yyyy-MM-dd HH:mm')

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader
          title={title}
          category={category}
          date={formattedDate}
          hostedBy={hostedBy}
          id={id}
        />
        <EventDetailedInfo
          description={description}
          date={formattedDate}
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
  event: eventPropTypes.isRequired,
}

EventDetailedPage.defaultProps = {}

function mapState(state, ownProps) {
  const currentEventId = ownProps.match.params.id
  let event = {}

  if (currentEventId && state.events.length > 0) {
    event = state.events.filter(evt => evt.id === currentEventId)[0]
  }

  if (!event.attendees) {
    event.attendees = []
  }

  return {
    event,
  }
}

export default connect(
  mapState,
  null
)(EventDetailedPage)
