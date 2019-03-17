import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'

import NotFound from './NotFound'
import NavBar from '../../features/nav/NavBar/'
import HomePage from '../../features/home/HomePage'
import EventDashBoard from '../../features/event/EventDashboard/'
import EventDetailedPage from '../../features/event/EventDetailed/'
import EventForm from '../../features/event/EventForm/'
import PeopleDashboard from '../../features/user/PeopleDashboard/'
import UserDetailedPage from '../../features/user/UserDetailed/'
import { SettingsDashboard } from '../../features/user/Settings/'
import ModalManager from '../../features/modals/Modal/ModalManager'
import Spinner from '../common/components/loaders/Spinner'
import { UserIsAuthenticated } from '../../features/auth/authWrapper'

class App extends Component {
  render() {
    const { isAuthLoaded } = this.props

    if (!isAuthLoaded) {
      return <Spinner size="big" dim content="Loading..." />
    }

    return (
      <>
        <ModalManager />
        <Switch>
          <Route path="/" exact component={HomePage} />
        </Switch>

        <Route
          path="/(.+)"
          render={() => (
            <>
              <NavBar />
              <Container className="main">
                <Switch>
                  <Route path="/events" component={EventDashBoard} />
                  <Route path="/event/:id" component={EventDetailedPage} />
                  <Route
                    path="/manage/:id"
                    component={UserIsAuthenticated(EventForm)}
                  />
                  <Route
                    path="/create-event"
                    component={UserIsAuthenticated(EventForm)}
                  />
                  <Route
                    path="/people"
                    component={UserIsAuthenticated(PeopleDashboard)}
                  />
                  <Route
                    path="/profile/:id"
                    component={UserIsAuthenticated(UserDetailedPage)}
                  />
                  <Route
                    path="/settings"
                    component={UserIsAuthenticated(SettingsDashboard)}
                  />
                  <Route component={NotFound} />
                </Switch>
              </Container>
            </>
          )}
        />
      </>
    )
  }
}

App.propTypes = {
  isAuthLoaded: PropTypes.bool.isRequired,
}

function mapState(state) {
  return {
    isAuthLoaded: state.firebase.auth.isLoaded || false,
  }
}

export default withRouter(connect(mapState)(App))
