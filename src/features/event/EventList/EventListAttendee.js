import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { List, Image } from 'semantic-ui-react'

function EventListAttendee({ displayName, photoURL, id }) {
  return (
    <List.Item>
      <Image
        as={Link}
        to={`/profile/${id}`}
        size="mini"
        circular
        title={displayName}
        src={photoURL || '/assets/user.png'}
      />
    </List.Item>
  )
}

EventListAttendee.propTypes = {
  id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  photoURL: PropTypes.string,
}

export default EventListAttendee
