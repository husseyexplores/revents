import React from 'react'
// import PropTypes from 'prop-types'
import { Segment, Header } from 'semantic-ui-react'

function EventActicity() {
  return (
    <div>
      <Header attached="top" content="Recent Activity" />
      <Segment attached>
        <p>Recent Acticity</p>
      </Segment>
    </div>
  )
}

EventActicity.propTypes = {}

EventActicity.defaultProps = {}

export default EventActicity
