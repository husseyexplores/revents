import React from 'react'
import PropTypes from 'prop-types'
import { Card, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

function PersonCard({ person }) {
  return (
    <Card as={Link} to={`/profile/${person.id}`}>
      <Image src={person.photoURL} />
      <Card.Content textAlign="center">
        <Card.Header content={person.displayName} />
      </Card.Content>
      <Card.Meta textAlign="center">
        <span>{person.city || 'Unkown City'}</span>
      </Card.Meta>
    </Card>
  )
}

PersonCard.propTypes = {
  person: PropTypes.object.isRequired,
}

export default PersonCard
