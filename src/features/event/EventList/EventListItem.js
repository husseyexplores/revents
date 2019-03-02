import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Segment, Item, Icon, List, Button } from 'semantic-ui-react'

import EventListAttendee from './EventListAttendee'

class EventListItem extends Component {
  renderAttendees() {
    const { event } = this.props
    if (event.attendees.length) {
      return event.attendees.map(attendee => (
        <EventListAttendee key={attendee.id} {...attendee} />
      ))
    }
    return null
  }

  render() {
    const { event } = this.props
    const {
      title,
      date,
      category,
      description,
      city,
      venue,
      hostedBy,
      hostPhotoURL,
      attendees,
    } = event

    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={hostPhotoURL} />
              <Item.Content>
                <Item.Header as="a">{title}</Item.Header>
                <Item.Description>
                  Hosted by <a>hosted by {hostedBy}</a>
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name="clock" /> {date} |
            <Icon name="map marker alternate" /> {venue}
          </span>
        </Segment>
        <Segment secondary>
          <List horizontal>{this.renderAttendees()}</List>
        </Segment>
        <Segment clearing>
          <span>{description}</span>
          <Button as="a" color="teal" floated="right" content="View" />
        </Segment>
      </Segment.Group>
    )
  }
}

EventListItem.propTypes = {
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
  }),
}

EventListItem.defaultProps = {}

export default EventListItem
