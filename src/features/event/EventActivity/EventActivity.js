import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Header, Feed, Sticky } from 'semantic-ui-react'

import EventActivityItem from './EventActivityItem'

function EventActivity({ activities, contextRef }) {
  return (
    <Sticky context={contextRef} offset={100}>
      <Header attached="top" content="Recent Activity" />
      <Segment attached>
        <Feed>
          {activities.length > 0 &&
            activities.map(activity => (
              <EventActivityItem key={activity.id} activity={activity} />
            ))}
        </Feed>
      </Segment>
    </Sticky>
  )
}

EventActivity.propTypes = {
  activities: PropTypes.array.isRequired,
  contextRef: PropTypes.object.isRequired,
}

EventActivity.defaultProps = {
  activities: [],
  contextRef: {},
}

export default EventActivity
