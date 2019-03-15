import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { combineValidators, isRequired } from 'revalidate'
import { Form, Segment, Button, Divider, Message } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'

import { TextInput } from '../../../app/common/components/form/'
import SocialLogin from '../SocialLogin'

import { loginUser, socialLogin } from '../../auth/authActions'

const LoginForm = ({
  loginUser,
  handleSubmit,
  socialLogin,
  error,
  invalid,
  submitting,
  reauth,
}) => {
  return (
    <Form
      size="large"
      onSubmit={handleSubmit(loginUser)}
      error
      warning={reauth}
    >
      <Segment>
        {reauth && <Message warning content="Please confirm your identity" />}
        <Field
          name="email"
          component={TextInput}
          autoFocus
          type="text"
          placeholder="Email Address"
        />
        <Field
          name="password"
          component={TextInput}
          type="password"
          placeholder="password"
        />
        {error && <Message error content={error} />}
        <Button
          loading={submitting}
          disabled={invalid || !!error || submitting}
          fluid
          size="large"
          color="teal"
        >
          Login
        </Button>
        <Divider horizontal>OR</Divider>
        <SocialLogin socialLogin={socialLogin} />
      </Segment>
    </Form>
  )
}

LoginForm.propTypes = {
  loginUser: PropTypes.func.isRequired,
  socialLogin: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  invalid: PropTypes.bool,
  submitting: PropTypes.bool,
  reauth: PropTypes.bool,
}

const validate = combineValidators({
  email: isRequired({ message: 'Email is required' }),
  password: isRequired({ message: 'Password is required' }),
})

const withReduxForm = reduxForm({
  form: 'loginForm',
  enableReinitialize: true,
  validate,
})(LoginForm)

const mapDispatch = {
  loginUser,
  socialLogin,
}

export default connect(
  null,
  mapDispatch
)(withReduxForm)
