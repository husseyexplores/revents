import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Segment, Button } from 'semantic-ui-react'

function UserDetailedSidebar({ isCurrentUser }) {
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
      ) : (
        <Button color="teal" fluid basic content="Follow User" />
      )}
    </Segment>
  )
}

UserDetailedSidebar.propTypes = {
  isCurrentUser: PropTypes.bool.isRequired,
}

export default UserDetailedSidebar
