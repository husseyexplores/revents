import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Segment, Grid, Icon, Button } from 'semantic-ui-react'

import EventDetailedMap from './EventDetailedMap'

class EventDetailedInfo extends Component {
  state = {
    showMap: false,
  }

  toggleShowMap = () => {
    this.setState(state => ({ showMap: !state.showMap }))
  }

  render() {
    const { description, date, venue, lat, lng } = this.props
    const { showMap } = this.state

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
              <Icon name="calendar" size="large" color="teal" />
            </Grid.Column>
            <Grid.Column width={15}>
              <span>{date}</span>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign="middle">
            <Grid.Column width={1}>
              <Icon name="marker" size="large" color="teal" />
            </Grid.Column>
            <Grid.Column width={11}>
              <span>{venue}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button
                color="teal"
                size="tiny"
                content={`${showMap ? 'Hide' : 'Show'} Map`}
                onClick={this.toggleShowMap}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        {showMap && <EventDetailedMap lat={lat} lng={lng} />}
      </Segment.Group>
    )
  }
}

EventDetailedInfo.propTypes = {
  description: PropTypes.string.isRequired,
  date: PropTypes.any.isRequired,
  venue: PropTypes.string.isRequired,
}

EventDetailedInfo.defaultProps = {}

export default EventDetailedInfo
