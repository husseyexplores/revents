import React from 'react'
import PropTypes from 'prop-types'
import { Form, Message, Select } from 'semantic-ui-react'

function SelectInput({
  input,
  placeholder,
  multiple,
  options,
  meta: { touched, error },
}) {
  return (
    <Form.Field error={touched && !!error}>
      <Select
        value={input.value || null}
        onChange={(e, data) => input.onChange(data.value)}
        placeholde={placeholder}
        options={options}
        multiple={multiple}
      />
      {touched && !!error && <Message error content={error} />}
    </Form.Field>
  )
}

SelectInput.propTypes = {
  input: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
    PropTypes.object,
  ]),
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  options: PropTypes.array,
  meta: PropTypes.object,
}

SelectInput.defaultProps = {}

export default SelectInput
