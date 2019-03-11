import React from 'react'
import PropTypes from 'prop-types'
import { Form, Message } from 'semantic-ui-react'

function TextArea({
  input,
  type,
  placeholder,
  autoFocus,
  width,
  rows,
  meta: { touched, error },
}) {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <textarea
        {...input}
        placeholder={placeholder}
        type={type}
        rows={rows}
        autoFocus={autoFocus}
      />
      {touched && !!error && <Message error content={error} />}
    </Form.Field>
  )
}

TextArea.propTypes = {
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
  rows: PropTypes.number,
  meta: PropTypes.object,
}

TextArea.defaultProps = {
  autoFocus: false,
}

export default TextArea
