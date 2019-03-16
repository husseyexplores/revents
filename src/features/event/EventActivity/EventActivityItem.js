import React from 'react'
import PropTypes from 'prop-types'
import { Feed } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

function renderSummary(activity) {
  switch (activity.type) {
    case 'newEvent':
      return (
        <div>
          New Event!{' '}
          <Feed.User as={Link} to={`/profile/${activity.hostUid}`}>
            {activity.hostedBy}
          </Feed.User>{' '}
          is hosting{' '}
          <Link to={`/event/${activity.eventId}`}>{activity.title}</Link>
        </div>
      )
    case 'cancelledEvent':
      return (
        <div>
          Event Cancelled!{' '}
          <Feed.User as={Link} to={`/profile/${activity.hostUid}`}>
            {activity.hostedBy}
          </Feed.User>{' '}
          has cancelled{' '}
          <Link to={`/event/${activity.eventId}`}>{activity.title}</Link>
        </div>
      )
    default:
      return null
  }
}

function EventActivityItem({ activity }) {
  return (
    <Feed.Event>
      <Feed.Label>
        <img src={activity.photoURL || '/assets/user.png'} alt="" />
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>{renderSummary(activity)}</Feed.Summary>
        <Feed.Meta>
          <Feed.Date>{distanceInWordsToNow(activity.timestamp)} ago</Feed.Date>
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  )
}

EventActivityItem.propTypes = {
  activity: PropTypes.object.isRequired,
}

export default EventActivityItem
