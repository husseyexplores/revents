import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Item, Header, Icon, List, Grid } from 'semantic-ui-react'
import formatDate from 'date-fns/format'

function UserDetailedDescription({
  user: { about, occupation, origin, displayName, interests, createdAt },
}) {
  const memberSince = formatDate(createdAt.toDate(), 'Do MMMM YYYY')

  return (
    <Segment>
      <Grid columns={2}>
        <Grid.Column width={10}>
          <Header icon="smile" content={`About ${displayName}`} />
          {occupation && (
            <p>
              I am a: <strong>{occupation}</strong>
            </p>
          )}
          {origin && (
            <p>
              Originally from <strong>{origin}</strong>
            </p>
          )}
          <p>
            Member Since: <strong>{memberSince}</strong>
          </p>
          {about && <p>{about}</p>}
        </Grid.Column>
        <Grid.Column width={6}>
          <Header icon="heart outline" content="Interests" />
          <List>
            {Array.isArray(interests) && interests.length > 0 ? (
              interests.map((interest, idx) => (
                <Item key={interest + idx}>
                  <Icon name="heart" />
                  <Item.Content style={{ textTransform: 'capitalize' }}>
                    {interest}
                  </Item.Content>
                </Item>
              ))
            ) : (
              <p>No interests.</p>
            )}
          </List>
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

UserDetailedDescription.propTypes = {
  user: PropTypes.object.isRequired,
}

export default UserDetailedDescription
