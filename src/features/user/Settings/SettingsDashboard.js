import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'

import SettingsNav from './SettingsNav'
import BasicPage from './BasicPage'
import AboutPage from './AboutPage'
import PhotosPage from './PhotosPage'
import AccountPage from './AccountPage'

import { updatePassword } from '../../auth/authActions'

function SettingsDashboard({ updatePassword, providerId }) {
  return (
    <Grid>
      <Grid.Column width={12}>
        <Switch>
          <Redirect exact from="/settings" to="/settings/basic" />
          <Route path="/settings/basic" component={BasicPage} />
          <Route path="/settings/about" component={AboutPage} />
          <Route path="/settings/photos" component={PhotosPage} />
          <Route
            path="/settings/account"
            render={() => (
              <AccountPage
                updatePassword={updatePassword}
                providerId={providerId}
              />
            )}
          />
        </Switch>
      </Grid.Column>
      <Grid.Column width={4}>
        <SettingsNav />
      </Grid.Column>
    </Grid>
  )
}

SettingsDashboard.propTypes = {
  updatePassword: PropTypes.func.isRequired,
  providerId: PropTypes.string.isRequired,
}

SettingsDashboard.defaultProps = {}

function mapState(state) {
  return {
    providerId:
      (state.firebase.auth.isLoaded &&
        state.firebase.auth.providerData[0].providerId) ||
      'LOADING_AUTH',
  }
}

const mapDispatch = {
  updatePassword,
}

export default compose(
  connect(
    mapState,
    mapDispatch
  )
)(SettingsDashboard)
