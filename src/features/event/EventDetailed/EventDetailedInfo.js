import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Segment, Grid, Icon, Button } from 'semantic-ui-react'

import EventDetailedMap from './EventDetailedMap'

function EventDetailedInfo({
  description,
  formattedDateTime,
  venue,
  lat,
  lng,
}) {
  const [showMap, setShowMap] = useState(false)

  function toggleShowMap() {
    setShowMap(!showMap)
  }

  return (
    <Segment.Group>
      <Segment attached="top">
        <Grid>
          <Grid.Column width={1}>
            <Icon size="large" color="teal" name="info" />
          </Grid.Column>
          <Grid.Column width={15}>
            <p>{description}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign="middle">
          <Grid.Column width={1}>
            <Icon name="calendar alternate" size="large" color="teal" />
          </Grid.Column>
          <Grid.Column width={15}>
            <span>{formattedDateTime}</span>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign="middle">
          <Grid.Column width={1}>
            <Icon name="map marker alternate" size="large" color="teal" />
          </Grid.Column>
          <Grid.Column width={11}>
            <span>{venue}</span>
          </Grid.Column>
          <Grid.Column width={4}>
            <Button
              color="teal"
              size="tiny"
              content={`${showMap ? 'Hide' : 'Show'} Map`}
              onClick={toggleShowMap}
            />
          </Grid.Column>
        </Grid>
      </Segment>
      {showMap && <EventDetailedMap lat={lat} lng={lng} />}
    </Segment.Group>
  )
}

EventDetailedInfo.propTypes = {
  description: PropTypes.string.isRequired,
  formattedDateTime: PropTypes.string.isRequired,
  venue: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
}

export default EventDetailedInfo
