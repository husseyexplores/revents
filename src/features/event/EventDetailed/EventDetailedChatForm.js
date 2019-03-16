import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { Button, Form } from 'semantic-ui-react'

import { TextArea } from '../../../app/common/components/form'

function EventDetailedChatForm({
  parentId,
  handleSubmit,
  addEventComment,
  reset,
  eventId,
  toggleForm,
}) {
  const [disableBtn, setDisableBtn] = useState(true)

  function handleCommentSubmit(values) {
    addEventComment(eventId, values, parentId)
    reset()
    if (typeof toggleForm === 'function') {
      toggleForm()
    }
  }

  function handleOnChange(e) {
    if (e.target.value.trim().length > 0) {
      setDisableBtn(false)
    } else {
      setDisableBtn(true)
    }
  }

  return (
    <Form reply onSubmit={handleSubmit(handleCommentSubmit)}>
      <Field
        component={TextArea}
        onChange={handleOnChange}
        name="comment"
        type="text"
        rows={1}
        style={{ height: 'auto' }}
      />
      <Button
        disabled={disableBtn}
        content="Add Reply"
        labelPosition="left"
        icon="edit"
        primary
      />
    </Form>
  )
}

EventDetailedChatForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  addEventComment: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  eventId: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  toggleForm: PropTypes.func,
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default reduxForm({
  Fields: 'comment',
})(EventDetailedChatForm)
