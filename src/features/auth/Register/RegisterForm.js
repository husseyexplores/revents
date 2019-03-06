import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Segment, Button } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import { TextInput } from '../../../app/common/components/form/'

const RegisterForm = () => {
  return (
    <div>
      <Form size="large">
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
          <Button fluid size="large" color="teal">
            Register
          </Button>
        </Segment>
      </Form>
    </div>
  )
}

const withReduxForm = reduxForm({
  form: 'registerForm',
  enableReinitialize: true,
})(RegisterForm)

export default connect()(withReduxForm)
