import React, { useEffect } from 'react'
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

import { getUserEvents, followUser, unFollowUser } from '../userActions'
import { userDetailedQuery } from '../userQueries'

function UserDetailedPage({
  isFollowing,
  curProfileUserUid,
  user,
  photos,
  isCurrentUser,
  isLoading,
  getUserEvents,
  followUser,
  unFollowUser,
  isEventsLoading,
  events,
}) {
  // Get user events
  useEffect(() => {
    if (user && user.createdAt) {
      ;(async () => {
        await getUserEvents(curProfileUserUid)
      })()
    }
  }, [getUserEvents, user, curProfileUserUid])
  if (isLoading) {
    return <Spinner size="big" content="Loading..." dim />
  }

  function changeTab(e, data) {
    getUserEvents(curProfileUserUid, data.activeIndex)
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
        <UserDetailedSidebar
          isCurrentUser={isCurrentUser}
          followUser={followUser}
          curProfileUserUid={curProfileUserUid}
          isFollowing={isFollowing}
          isLoading={isLoading}
          unFollowUser={unFollowUser}
        />
      </Grid.Column>

      {!photos ? (
        <Spinner size="big" content="Loading..." dim />
      ) : Array.isArray(photos) && photos.length > 0 ? (
        <Grid.Column width={12}>
          <UserDetailedPhotos photos={photos} />
        </Grid.Column>
      ) : null}

      <Grid.Column width={12}>
        <UserDetailedEvents
          events={events}
          isEventsLoading={isEventsLoading}
          changeTab={changeTab}
        />
      </Grid.Column>
    </Grid>
  )
}

UserDetailedPage.propTypes = {
  user: PropTypes.object.isRequired,
  curProfileUserUid: PropTypes.string.isRequired,
  signedInUserUid: PropTypes.string.isRequired,
  photos: PropTypes.array,
  isCurrentUser: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getUserEvents: PropTypes.func.isRequired,
  followUser: PropTypes.func.isRequired,
  unFollowUser: PropTypes.func.isRequired,
  events: PropTypes.array.isRequired,
  isEventsLoading: PropTypes.bool.isRequired,
  isFollowing: PropTypes.bool.isRequired,
}

function mapState(state, props) {
  const curProfileUserUid = props.match.params.id
  const signedInUserUid = state.firebase.auth.uid
  const isCurrentUser = curProfileUserUid === signedInUserUid

  let profile = {}
  if (isCurrentUser) {
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

  // convert event date to JS date object (from firestore timestamp)
  const events = state.events.userProfile.map(evt => ({
    ...evt,
    date: evt.date.toDate(),
  }))

  let isFollowing = false
  let following
  if (!isCurrentUser && !isEmpty(state.firestore.ordered.following)) {
    following = state.firestore.ordered.following
    isFollowing = following.some(person => person.id === curProfileUserUid)
  }

  return {
    events,
    isEventsLoading: state.async.isLoading,
    isCurrentUser,
    curProfileUserUid,
    signedInUserUid,
    user: profile,
    photos: state.firestore.ordered.photos,
    isLoading,
    isFollowing,
  }
}

const mapDispatch = {
  getUserEvents,
  followUser,
  unFollowUser,
}

export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  // same as this, point-free style
  // firestoreConnect(props => userDetailedQuery(props))
  firestoreConnect(userDetailedQuery)
)(UserDetailedPage)
