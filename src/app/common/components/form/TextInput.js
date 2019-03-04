import React from 'react'
import PropTypes from 'prop-types'
import { Form, Label } from 'semantic-ui-react'

function TextInput({
  input,
  type,
  placeholder,
  width,
  meta: { touched, error },
}) {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <input {...input} placeholder={placeholder} type={type} />
      {touched && !!error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  )
}

TextInput.propTypes = {
  input: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
    PropTypes.object,
  ]),
  type: PropTypes.string,
  placeholder: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  meta: PropTypes.object,
}

TextInput.defaultProps = {}

export default TextInput