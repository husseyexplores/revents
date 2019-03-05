import React from 'react'
import PropType from 'prop-types'
import styled from '@emotion/styled'
import GoogleMapReact from 'google-map-react'
import { Segment, Icon } from 'semantic-ui-react'

import { googleMapsSecrets } from '../../../secret'

const MarkerWrapper = styled.div`
  position: absolute;
  font-size: 14px;
  width: 100px;
  cursor: pointer;
`

const Marker = () => (
  <MarkerWrapper>
    <Icon name="map marker alternate" size="big" color="pink" />
  </MarkerWrapper>
)

function EventDetailedMap({ lat, lng, zoom }) {
  const center = {
    lat: Number(lat.toFixed(2)),
    lng: Number(lng.toFixed(2)),
  }

  return (
    <Segment attached="bottom" style={{ padding: 0 }}>
      <div style={{ height: '300px', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: googleMapsSecrets.API_KEY }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <Marker lat={lat} lng={lng} />
        </GoogleMapReact>
      </div>
    </Segment>
  )
}

EventDetailedMap.propTypes = {
  lat: PropType.number,
  lng: PropType.number,
  zoom: PropType.number,
}

EventDetailedMap.defaultProps = {
  zoom: 14,
}

export default EventDetailedMap
