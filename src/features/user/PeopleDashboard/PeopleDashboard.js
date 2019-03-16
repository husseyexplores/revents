import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect, isEmpty } from 'react-redux-firebase'
import { Grid, Segment, Header, Card } from 'semantic-ui-react'

import PersonCard from './PersonCard'

import { peopleDashboardQuery } from '../userQueries'

function PeopleDashboard({ followers, following }) {
  return (
    <Grid>
      <Grid.Column width={16}>
        <Segment>
          <Header dividing content="People following me" />
          <Card.Group itemsPerRow={8} stackable>
            {followers.length > 0 &&
              followers.map(person => (
                <PersonCard key={person.id} person={person} />
              ))}
            {followers.length === 0 && (
              <p>
                You are not being followed by anyone yet. Make some friends?
              </p>
            )}
          </Card.Group>
        </Segment>
        <Segment>
          <Header dividing content="People I'm following" />
          <Card.Group itemsPerRow={8} stackable>
            {following.length > 0 &&
              following.map(person => (
                <PersonCard key={person.id} person={person} />
              ))}
            {following.length === 0 && <p>You are not following anyone.</p>}
          </Card.Group>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

PeopleDashboard.propTypes = {
  following: PropTypes.array.isRequired,
  followers: PropTypes.array.isRequired,
}

function mapState(state) {
  let following = []
  if (!isEmpty(state.firestore.ordered.following)) {
    following = state.firestore.ordered.following
  }

  let followers = []
  if (!isEmpty(state.firestore.ordered.followers)) {
    followers = state.firestore.ordered.followers
  }

  return {
    userUid: state.firebase.auth.uid,
    following,
    followers,
  }
}

export default compose(
  connect(mapState),
  firestoreConnect(peopleDashboardQuery)
)(PeopleDashboard)
