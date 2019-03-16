import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Segment, Button } from 'semantic-ui-react'

function UserDetailedSidebar({
  isCurrentUser,
  followUser,
  unFollowUser,
  curProfileUserUid,
  isLoading,
  isFollowing,
}) {
  function handleFollowUser(userId) {
    return () => followUser(userId)
  }
  function handleUnFollowUser(userId) {
    return () => unFollowUser(userId)
  }
  return (
    <Segment>
      {isCurrentUser ? (
        <Button
          color="teal"
          fluid
          basic
          content="Edit Profile"
          as={Link}
          to="/settings/about"
        />
      ) : !isLoading && !isFollowing ? (
        <Button
          disabled={isLoading}
          loading={isLoading}
          color="teal"
          fluid
          basic
          content="Follow User"
          onClick={handleFollowUser(curProfileUserUid)}
        />
      ) : !isLoading && isFollowing ? (
        <Button
          disabled={isLoading}
          loading={isLoading}
          color="teal"
          fluid
          basic
          content="Unfollow User"
          onClick={handleUnFollowUser(curProfileUserUid)}
        />
      ) : (
        <Button
          disabled={isLoading}
          loading={isLoading}
          color="teal"
          fluid
          basic
          content="Loading..."
        />
      )}
    </Segment>
  )
}

UserDetailedSidebar.propTypes = {
  isCurrentUser: PropTypes.bool.isRequired,
  followUser: PropTypes.func.isRequired,
  unFollowUser: PropTypes.func.isRequired,
  curProfileUserUid: PropTypes.string.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default UserDetailedSidebar
