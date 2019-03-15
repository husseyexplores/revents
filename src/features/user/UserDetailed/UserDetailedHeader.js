import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Item, Header } from 'semantic-ui-react'
import differenceInYears from 'date-fns/difference_in_calendar_iso_years'

function UserDetailedHeader({
  user: { dateOfBirth, photoURL, displayName, occupation, city },
}) {
  let userAge = null
  if (dateOfBirth) {
    userAge = differenceInYears(Date.now(), dateOfBirth.toDate())
  }

  return (
    <Segment>
      <Item.Group>
        <Item>
          <Item.Image
            avatar
            size="small"
            src={photoURL || '/assets/user.png'}
          />
          <Item.Content verticalAlign="bottom">
            <Header as="h1">{displayName}</Header>
            <br />
            {occupation && <Header as="h3">{occupation}</Header>}
            <br />
            <Header as="h3">
              {userAge ? userAge : null}
              {userAge && city ? ', ' : null}
              {city ? `Lives in ${city}` : null}
            </Header>
          </Item.Content>
        </Item>
      </Item.Group>
    </Segment>
  )
}

UserDetailedHeader.propTypes = {
  user: PropTypes.object.isRequired,
}

export default UserDetailedHeader
