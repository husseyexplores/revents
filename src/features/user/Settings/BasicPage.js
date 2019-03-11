import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Form, Header, Divider, Button } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'
import { subYears } from 'date-fns'

import {
  TextInput,
  PlaceInput,
  DateInput,
  RadioInput,
} from '../../../app/common/components/form'
import Spinner from '../../../app/common/components/loaders/Spinner'

function BasicPage({
  pristine,
  submitting,
  handleSubmit,
  updateProfile,
  isAuthLoaded,
}) {
  if (!isAuthLoaded) {
    return <Spinner content="Loading..." size="big" dim />
  }

  return (
    <Segment>
      <Header dividing size="large" content="Basics" />
      <Form error onSubmit={handleSubmit(updateProfile)}>
        <Field
          width={8}
          name="displayName"
          type="text"
          component={TextInput}
          placeholder="Known As"
        />
        <Form.Group inline>
          <label>Gender: </label>
          <Field
            name="gender"
            component={RadioInput}
            options={[
              {
                id: 'gender-male',
                value: 'male',
                label: 'Male',
              },
              {
                id: 'gender-female',
                value: 'female',
                label: 'Female',
              },
            ]}
          />
        </Form.Group>
        <Field
          width={8}
          name="dateOfBirth"
          component={DateInput}
          placeholder="Date of Birth"
          dateFormat="yyyy-MM-dd"
          DropdownMode="select"
          showYearDropdown
          showMonthDropdown
          maxDate={subYears(new Date(), 18)}
        />
        <Field
          name="city"
          placeholder="Home Town"
          searchOptions={{
            types: ['(cities)'],
          }}
          label="Female"
          component={PlaceInput}
          width={8}
        />
        <Divider />
        <Button
          loading={submitting}
          disabled={pristine || submitting}
          size="large"
          positive
          content="Update Profile"
        />
      </Form>
    </Segment>
  )
}

BasicPage.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  isAuthLoaded: PropTypes.bool.isRequired,
}

export default reduxForm({
  form: 'userProfile',
  enableReinitialize: true,
})(BasicPage)
