import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'

function RadioInput({ input, options }) {
  return options.map(option => (
    <Form.Field key={option.id}>
      <div className="ui radio checkbox">
        <input
          id={option.id}
          type="radio"
          {...input}
          value={option.value}
          checked={option.value === input.value}
        />
        <label htmlFor={option.id} style={{ cursor: 'pointer' }}>
          {option.label}
        </label>
      </div>
    </Form.Field>
  ))
}

RadioInput.propTypes = {
  input: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
    PropTypes.object,
  ]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
}

export default RadioInput
