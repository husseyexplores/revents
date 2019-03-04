import React from 'react'
import PropTypes from 'prop-types'
import { Form, Label } from 'semantic-ui-react'

function TextArea({
  input,
  type,
  placeholder,
  width,
  rows,
  meta: { touched, error },
}) {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <textarea {...input} placeholder={placeholder} type={type} rows={rows} />
      {touched && !!error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
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
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rows: PropTypes.number,
  meta: PropTypes.object,
}

TextArea.defaultProps = {}

export default TextArea
