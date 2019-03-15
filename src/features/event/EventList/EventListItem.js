import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import formatDate from 'date-fns/format'
import { Segment, Item, Icon, List, Button, Label } from 'semantic-ui-react'

import EventListAttendee from './EventListAttendee'

import { objectToArray } from '../../../app/common/util/helpers'

function EventListItem({ event }) {
  const {
    cancelled,
    title,
    date,
    description,
    venue,
    hostedBy,
    hostPhotoURL,
    attendees,
  } = event

  const formattedDate = formatDate(date.toDate(), 'dddd, Do MMMM')
  const formattedTime = formatDate(date.toDate(), 'HH:mm')

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" circular src={hostPhotoURL} />
            <Item.Content>
              <Item.Header as={Link} to={`/event/${event.id}`}>
                {title}
              </Item.Header>
              <Item.Description>
                Hosted by{' '}
                <Link to={`/profile/${event.hostUid}`}>
                  hosted by {hostedBy}
                </Link>
              </Item.Description>

              {cancelled && (
                <Label
                  style={{ top: -40 }}
                  ribbon="right"
                  content="This event has been cancelled"
                  color="red"
                />
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock outline" /> {`${formattedDate} at ${formattedTime}`}{' '}
          |
          <Icon name="map marker alternate" /> {venue}
        </span>
      </Segment>
      <Segment secondary>
        <List horizontal>
          {objectToArray(attendees).map(attendee => (
            <EventListAttendee key={attendee.id} {...attendee} />
          ))}
        </List>
      </Segment>
      <Segment clearing>
        <span>{description}</span>
        <Button
          as={Link}
          to={`/event/${event.id}`}
          color="teal"
          floated="right"
          content="View"
        />
      </Segment>
    </Segment.Group>
  )
}

EventListItem.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.any,
    category: PropTypes.string,
    description: PropTypes.string,
    city: PropTypes.string,
    venue: PropTypes.string,
    hostedBy: PropTypes.string,
    hostPhotoURL: PropTypes.string,
    attendees: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object,
    ]),
  }).isRequired,
}

export default EventListItem
