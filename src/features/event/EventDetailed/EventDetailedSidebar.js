import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Segment, List, Label, Image } from 'semantic-ui-react'

function EventDetailedSidebar({ attendees }) {
  return (
    <div>
      <Segment
        textAlign="center"
        style={{ border: 'none' }}
        attached="top"
        secondary
        inverted
        color="teal"
      >
        {attendees && attendees.length}{' '}
        {attendees && attendees.length === 1 ? 'Person ' : 'People '}
        Going
      </Segment>
      <Segment attached>
        <List relaxed divided verticalAlign="middle">
          {attendees &&
            attendees.map(attendee => (
              <List.Item key={attendee.id} style={{ position: 'relative' }}>
                {attendee.host && (
                  <Label
                    style={{ position: 'absolute' }}
                    color="orange"
                    ribbon="right"
                  >
                    Host
                  </Label>
                )}
                <Image
                  avatar
                  size="tiny"
                  src={attendee.photoURL || '/assets/user.png'}
                />
                <List.Content verticalAlign="middle">
                  <List.Header as="h3">
                    <Link to={`/profile/${attendee.id}`}>
                      {attendee.displayName}
                    </Link>
                  </List.Header>
                </List.Content>
              </List.Item>
            ))}
        </List>
      </Segment>
    </div>
  )
}

EventDetailedSidebar.propTypes = {
  attendees: PropTypes.array,
}

EventDetailedSidebar.defaultProps = {}

export default EventDetailedSidebar
