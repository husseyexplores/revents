import React from 'react'
import PropTypes from 'prop-types'
import { Form, Message } from 'semantic-ui-react'

function TextInput({
  input,
  type,
  placeholder,
  autoFocus,
  width,
  meta: { touched, error },
}) {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <input
        {...input}
        placeholder={placeholder}
        type={type}
        autoFocus={autoFocus}
      />
      {touched && !!error && <Message error content={error} />}
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
  autoFocus: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  meta: PropTypes.object,
}

TextInput.defaultProps = {
  autoFocus: false,
}

export default TextInput
