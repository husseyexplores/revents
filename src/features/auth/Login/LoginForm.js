import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Segment, Button, Label } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import { TextInput } from '../../../app/common/components/form/'

import { loginUser } from '../../auth/authActions'

const LoginForm = ({ loginUser, handleSubmit, error }) => {
  return (
    <Form size="large" onSubmit={handleSubmit(loginUser)}>
      <Segment>
        <Field
          name="email"
          component={TextInput}
          type="text"
          placeholder="Email Address"
        />
        <Field
          name="password"
          component={TextInput}
          type="password"
          placeholder="password"
        />
        {error && (
          <Label basic color="red">
            {error}
          </Label>
        )}
        <Button fluid size="large" color="teal">
          Login
        </Button>
      </Segment>
    </Form>
  )
}

LoginForm.propTypes = {
  loginUser: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}

const withReduxForm = reduxForm({
  form: 'loginForm',
  enableReinitialize: true,
})(LoginForm)

const mapDispatch = {
  loginUser,
}

export default connect(
  null,
  mapDispatch
)(withReduxForm)
