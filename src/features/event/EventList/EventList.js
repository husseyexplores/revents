import React from 'react'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroller'

import EventListItem from './EventListItem'

function EventList({ events, getMoreEvents, isLoading, hasMoreEvents }) {
  if (!events || !events.length) {
    return <h4>There are no events to display.</h4>
  }

  if (events && events.length > 0) {
    const eventsArr = events.map(evt => (
      <EventListItem key={evt.id} event={evt} />
    ))

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={getMoreEvents}
        hasMore={!isLoading && hasMoreEvents}
        initialLoad={false}
      >
        <div>{eventsArr}</div>
      </InfiniteScroll>
    )
  }

  return null
}

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  hasMoreEvents: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getMoreEvents: PropTypes.func.isRequired,
}

EventList.defaultProps = {}

export default EventList
