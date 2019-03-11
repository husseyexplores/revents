import React from 'react'
import PropTypes from 'prop-types'
import { Button, Divider, Form, Header, Segment } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'

import {
  TextInput,
  TextArea,
  SelectInput,
  PlaceInput,
  RadioInput,
} from '../../../app/common/components/form'
import Spinner from '../../../app/common/components/loaders/Spinner'

const interests = [
  { key: 'drinks', text: 'Drinks', value: 'drinks' },
  { key: 'culture', text: 'Culture', value: 'culture' },
  { key: 'film', text: 'Film', value: 'film' },
  { key: 'food', text: 'Food', value: 'food' },
  { key: 'music', text: 'Music', value: 'music' },
  { key: 'travel', text: 'Travel', value: 'travel' },
]

function AboutPage({
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
      <Header dividing size="large" content="About Me" />
      <p>Complete your profile to get the most out of this site</p>
      <Form error onSubmit={handleSubmit(updateProfile)}>
        <Form.Group inline>
          <label>Tell us your status: </label>
          <Field
            name="status"
            component={RadioInput}
            options={[
              {
                id: 'status-single',
                value: 'single',
                label: 'Single',
              },
              {
                id: 'status-relationship',
                value: 'relationship',
                label: 'Relationship',
              },
              {
                id: 'status-Marreid',
                value: 'married',
                label: 'Married',
              },
            ]}
          />
        </Form.Group>
        <Divider />
        <label>Tell us about yourself</label>
        <Field name="about" component={TextArea} placeholder="About Me" />
        <Field
          name="interests"
          component={SelectInput}
          options={interests}
          value="interests"
          multiple={true}
          placeholder="Select your interests"
        />
        <Field
          width={8}
          name="occupation"
          type="text"
          component={TextInput}
          placeholder="Occupation"
        />
        <Field
          width={8}
          name="origin"
          searchOptions={{
            types: ['(regions)'],
          }}
          component={PlaceInput}
          placeholder="Place of Origin"
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

AboutPage.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
}

export default reduxForm({
  form: 'userProfile',
  enableReinitialize: true,
})(AboutPage)
