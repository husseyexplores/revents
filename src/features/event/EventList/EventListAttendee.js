import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { List, Image } from 'semantic-ui-react'

class EventListAttendee extends Component {
  render() {
    const { name, photoURL } = this.props

    return (
      <List.Item>
        <Image as="a" size="mini" circular title={name} src={photoURL} />
      </List.Item>
    )
  }
}

EventListAttendee.propTypes = {
  name: PropTypes.string,
  photoURL: PropTypes.string,
}

EventListAttendee.defaultProps = {}

export default EventListAttendee
