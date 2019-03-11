import React from 'react'
import PropTypes from 'prop-types'
import { withFirestore } from 'react-redux-firebase'
import { Button, Icon } from 'semantic-ui-react'

function SocialLogin({ socialLogin, firestore }) {
  const facebookLoginHandler = () => socialLogin('facebook', firestore)
  const googleLoginHandler = () => socialLogin('google', firestore)

  return (
    <div>
      <Button
        type="button"
        style={{ marginBottom: '10px' }}
        fluid
        color="facebook"
        onClick={facebookLoginHandler}
      >
        <Icon name="facebook" /> Login with Facebook
      </Button>

      <Button
        type="button"
        fluid
        color="google plus"
        onClick={googleLoginHandler}
      >
        <Icon name="google plus" />
        Login with Google
      </Button>
    </div>
  )
}

SocialLogin.propTypes = {
  socialLogin: PropTypes.func.isRequired,
  firestore: PropTypes.object,
}

SocialLogin.defaultProps = {}

export default withFirestore(SocialLogin)
