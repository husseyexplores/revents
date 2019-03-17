import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Segment, Header, Card, Image, Tab } from 'semantic-ui-react'
import format from 'date-fns/format'

function formatDateTime(date) {
  const formattedDate = format(date, 'dddd, Do MMMM')
  const formattedTime = format(date, 'h:mm A')
  return `${formattedDate} at ${formattedTime}`
}

const panes = [
  { menuItem: 'All Events', pane: { key: 'allEvents' } },
  { menuItem: 'Past Events', pane: { key: 'pastEvents' } },
  { menuItem: 'Future Events', pane: { key: 'futureEvents' } },
  { menuItem: 'Hosting', pane: { key: 'hosting' } },
]

function UserDetailedEvents({ events, isEventsLoading, changeTab }) {
  return (
    <Segment attached loading={isEventsLoading}>
      <Header icon="calendar" content="Events" />
      <Tab
        onTabChange={changeTab}
        panes={panes}
        menu={{ secondary: true, pointing: true }}
      />
      <br />

      {events && events.length > 0 && (
        <Card.Group itemsPerRow={5}>
          {events.map(evt => (
            <Card key={evt.id} as={Link} to={`/event/${evt.id}`}>
              <Image src={`/assets/categoryImages/${evt.category}.jpg`} />
              <Card.Content>
                <Card.Header textAlign="center">{evt.title}</Card.Header>
                <Card.Meta textAlign="center">
                  {formatDateTime(evt.date)}
                </Card.Meta>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      )}
      {events && events.length === 0 && <p>No events.</p>}
    </Segment>
  )
}

UserDetailedEvents.propTypes = {
  isEventsLoading: PropTypes.bool.isRequired,
  events: PropTypes.array.isRequired,
  changeTab: PropTypes.func.isRequired,
}

UserDetailedEvents.defaultProps = {}

export default UserDetailedEvents
