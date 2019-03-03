import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Button } from 'semantic-ui-react'

function SignedOutMenu({ handleSignIn }) {
  return (
    <>
      <Menu.Item position="right">
        <Button basic inverted content="Login" onClick={handleSignIn} />
        <Button
          basic
          inverted
          content="Register"
          style={{ marginLeft: '0.5em' }}
        />
      </Menu.Item>
    </>
  )
}

SignedOutMenu.propTypes = {
  handleSignIn: PropTypes.func,
}

SignedOutMenu.defaultProps = {}

export default SignedOutMenu
