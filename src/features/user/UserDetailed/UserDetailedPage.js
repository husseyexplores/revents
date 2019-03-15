import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { firestoreConnect, isEmpty } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'

import UserDetailedHeader from './UserDetailedHeader'
import UserDetailedDescription from './UserDetailedDescription'
import UserDetailedPhotos from './UserDetailedPhotos'
import UserDetailedEvents from './UserDetailedEvents'
import UserDetailedSidebar from './UserDetailedSidebar'
import Spinner from '../../../app/common/components/loaders/Spinner'

import { userDetailedQuery } from '../userQueries'

function UserDetailedPage({ user, photos, isCurrentUser, isLoading }) {
  if (isLoading) {
    return <Spinner size="big" content="Loading..." dim />
  }

  return (
    <Grid>
      <Grid.Column width={16}>
        <UserDetailedHeader user={user} />
      </Grid.Column>
      <Grid.Column width={12}>
        <UserDetailedDescription user={user} />
      </Grid.Column>
      <Grid.Column width={4}>
        <UserDetailedSidebar isCurrentUser={isCurrentUser} />
      </Grid.Column>

      {!photos ? (
        <Spinner size="big" content="Loading..." dim />
      ) : Array.isArray(photos) && photos.length > 0 ? (
        <Grid.Column width={12}>
          <UserDetailedPhotos photos={photos} />
        </Grid.Column>
      ) : null}

      <Grid.Column width={12}>
        <UserDetailedEvents />
      </Grid.Column>
    </Grid>
  )
}

UserDetailedPage.propTypes = {
  user: PropTypes.object.isRequired,
  photos: PropTypes.array,
  isCurrentUser: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

function mapState(state, props) {
  const userUid = props.match.params.id
  let profile = {}
  if (userUid === state.firebase.auth.uid) {
    profile = state.firebase.profile
  } else if (!isEmpty(state.firestore.ordered.profile)) {
    profile = state.firestore.ordered.profile[0]
  }

  // if profile is loaded, set flag to true
  let isLoading = profile.createdAt ? false : true

  // if profile is loaded and status is `requesting`,
  // set the flag to true again
  if (!isLoading && state.firestore.status.requesting) {
    isLoading = Object.values(state.firestore.status.requesting).some(
      val => val === true
    )
  }

  return {
    isCurrentUser: userUid === state.firebase.auth.uid,
    userUid: userUid,
    user: profile,
    photos: state.firestore.ordered.photos,
    isLoading,
  }
}

export default compose(
  connect(mapState),
  // same as this, point-free style
  // firestoreConnect(props => userDetailedQuery(props))
  firestoreConnect(userDetailedQuery)
)(UserDetailedPage)
