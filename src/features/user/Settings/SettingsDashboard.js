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
import { updateProfile } from '../../user/userActions'

function SettingsDashboard({
  updatePassword,
  providerId,
  user,
  updateProfile,
  isAuthLoaded,
}) {
  return (
    <Grid>
      <Grid.Column width={12}>
        <Switch>
          <Redirect exact from="/settings" to="/settings/basic" />
          <Route
            path="/settings/basic"
            render={() => (
              <BasicPage
                initialValues={user}
                updateProfile={updateProfile}
                isAuthLoaded={isAuthLoaded}
              />
            )}
          />
          <Route
            path="/settings/about"
            render={() => (
              <AboutPage
                updateProfile={updateProfile}
                initialValues={user}
                isAuthLoaded={isAuthLoaded}
              />
            )}
          />
          <Route path="/settings/photos" component={PhotosPage} />
          <Route
            path="/settings/account"
            render={() => (
              <AccountPage
                updatePassword={updatePassword}
                providerId={providerId}
                isAuthLoaded={isAuthLoaded}
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
  updateProfile: PropTypes.func.isRequired,
  providerId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  isAuthLoaded: PropTypes.bool.isRequired,
}

SettingsDashboard.defaultProps = {}

function mapState(state) {
  return {
    providerId:
      (state.firebase.auth.isLoaded &&
        state.firebase.auth.providerData[0].providerId) ||
      '',
    user: state.firebase.profile, // firestore document - stored in firebase state
    isAuthLoaded:
      (state.firebase.auth.isLoaded && !!state.firebase.profile.displayName) ||
      false,
  }
}

const mapDispatch = {
  updatePassword,
  updateProfile,
}

export default compose(
  connect(
    mapState,
    mapDispatch
  )
)(SettingsDashboard)
