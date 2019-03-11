import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import {
  combineValidators,
  composeValidators,
  hasLengthGreaterThan,
  isRequired,
} from 'revalidate'
import { withFirestore } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { Form, Segment, Button, Divider, Message } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'

import { TextInput } from '../../../app/common/components/form/'
import SocialLogin from '../SocialLogin'

import { registerUser, socialLogin } from '../authActions'

function RegisterForm({
  handleSubmit,
  error,
  invalid,
  submitting,
  registerUser,
  socialLogin,
  firestore,
}) {
  const onSubmit = formValues => {
    return registerUser(formValues, firestore)
  }
  return (
    <div>
      <Form size="large" onSubmit={handleSubmit(onSubmit)} error>
        <Segment>
          <Field
            name="displayName"
            type="text"
            component={TextInput}
            placeholder="Display Name"
          />
          <Field
            name="email"
            type="text"
            component={TextInput}
            placeholder="Email"
          />
          <Field
            name="password"
            type="password"
            component={TextInput}
            placeholder="Password"
          />

          {error && <Message error content={error} />}
          <Button
            loading={submitting}
            disabled={invalid || submitting || !!error}
            fluid
            size="large"
            color="teal"
          >
            Register
          </Button>

          <Divider horizontal>OR</Divider>
          <SocialLogin socialLogin={socialLogin} />
        </Segment>
      </Form>
    </div>
  )
}

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired,
  socialLogin: PropTypes.func.isRequired,
  firestore: PropTypes.object,
  error: PropTypes.string,
  invalid: PropTypes.bool,
  submitting: PropTypes.bool,
}

const mapDispatch = {
  registerUser,
  socialLogin,
}

const validate = combineValidators({
  displayName: isRequired('Display name'),
  email: isRequired('Email'),
  password: composeValidators(
    isRequired({ message: 'Password is required' }),
    hasLengthGreaterThan(8)({
      message: 'Password should be at least 8 characters',
    })
  )(),
})

export default compose(
  withFirestore,
  reduxForm({
    form: 'registerForm',
    enableReinitialize: true,
    validate,
  }),
  connect(
    null,
    mapDispatch
  )
)(RegisterForm)
