import React from 'react'
import PropTypes from 'prop-types'
import { Form, Label } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function DateInput({
  input: { value, onChange, ...restInput },
  width,
  placeholder,
  meta: { touched, error },
  ...restProps
}) {
  let formattedDate = null

  if (value) {
    try {
      formattedDate = value.toDate()
    } catch (e) {
      formattedDate = new Date(value)
    }
  }

  return (
    <Form.Field error={touched && !!error} width={width}>
      <DatePicker
        {...restProps}
        placeholderText={placeholder}
        selected={formattedDate}
        onChange={onChange}
        {...restInput}
        onKeyDown={e => e.preventDefault()}
      />
      {touched && !!error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  )
}

DateInput.propTypes = {
  input: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
    PropTypes.object,
  ]),
  placeholder: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  meta: PropTypes.object,
}

DateInput.defaultProps = {}

export default DateInput
