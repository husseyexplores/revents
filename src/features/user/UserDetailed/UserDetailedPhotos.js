import React from 'react'
import PropTypes from 'prop-types'
import LazyLoad from 'react-lazyload'
import { Segment, Header, Image } from 'semantic-ui-react'

function UserDetailedPhotos({ photos }) {
  return (
    <Segment attached>
      <Header icon="image" content="Photos" />

      <Image.Group size="small">
        {photos.map(photo => (
          <LazyLoad
            key={photo.id}
            height={150}
            placeholder={<Image src={'/assets/user.png'} />}
          >
            <Image src={photo.url} />
          </LazyLoad>
        ))}
      </Image.Group>
    </Segment>
  )
}

UserDetailedPhotos.propTypes = {
  photos: PropTypes.array.isRequired,
}

export default UserDetailedPhotos
