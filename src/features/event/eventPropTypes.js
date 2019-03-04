import PropTypes from 'prop-types'

const titlePropType = PropTypes.string
const datePropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.instanceOf(Date),
])
const categoryPropType = PropTypes.string
const descriptionPropType = PropTypes.string
const cityPropType = PropTypes.string
const venuePropType = PropTypes.string
const hostedByPropType = PropTypes.string
const hostPhotoURLPropType = PropTypes.string
const attendeesPropType = PropTypes.arrayOf(PropTypes.object)

const eventPropTypes = PropTypes.shape({
  title: titlePropType.isRequired,
  date: datePropType.isRequired,
  category: categoryPropType.isRequired,
  description: descriptionPropType.isRequired,
  city: cityPropType.isRequired,
  venue: venuePropType.isRequired,
  hostedBy: hostedByPropType.isRequired,
  hostPhotoURL: hostPhotoURLPropType.isRequired,
  attendees: attendeesPropType.isRequired,
})

export {
  titlePropType,
  datePropType,
  categoryPropType,
  descriptionPropType,
  cityPropType,
  venuePropType,
  hostedByPropType,
  hostPhotoURLPropType,
  attendeesPropType,
  eventPropTypes,
}
