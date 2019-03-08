import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Menu, Image, Dropdown } from 'semantic-ui-react'

function SignedInMenu({ handleSignOut, auth: { email } }) {
  return (
    <Menu.Item position="right">
      <Image avatar spaced="right" src="/assets/user.png" />
      <Dropdown pointing="top left" text={email}>
        <Dropdown.Menu>
          <Dropdown.Item text="Create Event" icon="plus" />
          <Dropdown.Item text="My Events" icon="calendar" />
          <Dropdown.Item text="My Network" icon="users" />
          <Dropdown.Item text="My Profile" icon="user" />
          <Dropdown.Item
            as={Link}
            to="/settings"
            text="Settings"
            icon="settings"
          />
          <Dropdown.Item text="Sign Out" icon="power" onClick={handleSignOut} />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  )
}

SignedInMenu.propTypes = {
  handleSignOut: PropTypes.func,
  auth: PropTypes.object,
}

SignedInMenu.defaultProps = {}

export default SignedInMenu
