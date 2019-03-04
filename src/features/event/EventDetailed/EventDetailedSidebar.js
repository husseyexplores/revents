import React from 'react'
import PropTypes from 'prop-types'
import { Segment, List, Label, Image } from 'semantic-ui-react'

function EventDetailedSidebar({ attendees }) {
  const isHost = false

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
                {isHost && (
                  <Label
                    style={{ position: 'absolute' }}
                    color="orange"
                    ribbon="right"
                  >
                    Host
                  </Label>
                )}
                <Image avatar size="tiny" src={attendee.photoURL} />
                <List.Content verticalAlign="middle">
                  <List.Header as="h3">
                    <a>{attendee.name}</a>
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
