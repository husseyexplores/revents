import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Segment, Image, Item, Header, Button } from 'semantic-ui-react'

const eventImageStyle = {
  filter: 'brightness(30%)',
}

const eventImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white',
}

function EventDetailedHeader({
  event,
  isHost,
  isGoing,
  goingToEvent,
  cancelGoingToEvent,
}) {
  const { title, category, date, hostedBy, id } = event

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: '0' }}>
        <Image
          src={`/assets/categoryImages/${category}.jpg`}
          fluid
          style={eventImageStyle}
        />

        <Segment basic style={eventImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={title}
                  style={{ color: 'white' }}
                />
                <p>{date}</p>
                <p>
                  Hosted by <strong>{hostedBy}</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached="bottom">
        {!isHost && (
          <>
            {isGoing && (
              <Button onClick={() => cancelGoingToEvent(event)}>
                Cancel My Place
              </Button>
            )}
            {!isGoing && (
              <Button onClick={() => goingToEvent(event)} color="teal">
                JOIN THIS EVENT
              </Button>
            )}
          </>
        )}

        {isHost && (
          <Button as={Link} to={`/manage/${id}`} color="orange">
            Manage Event
          </Button>
        )}
      </Segment>
    </Segment.Group>
  )
}

EventDetailedHeader.propTypes = {
  event: PropTypes.object.isRequired,
  isHost: PropTypes.bool.isRequired,
  isGoing: PropTypes.bool.isRequired,
  goingToEvent: PropTypes.func.isRequired,
  cancelGoingToEvent: PropTypes.func.isRequired,
}

export default EventDetailedHeader
