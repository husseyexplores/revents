import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import NavBar from '../../features/nav/NavBar/'
import HomePage from '../../features/home/HomePage'
import EventDashBoard from '../../features/event/EventDashboard/'
import EventDetailedPage from '../../features/event/EventDetailed/'
import EventForm from '../../features/event/EventForm/'
import PeopleDashboard from '../../features/user/PeopleDashboard/'
import UserDetailedPage from '../../features/user/UserDetailed/'
import { SettingsDashboard } from '../../features/user/Settings/'
import ModalManager from '../../features/modals/Modal/ModalManager'

import TemporaryComponent from '../../features/temp/'

class App extends Component {
  render() {
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
                  <Route path="/manage/:id" component={EventForm} />
                  <Route path="/create-event" component={EventForm} />
                  <Route path="/people" component={PeopleDashboard} />
                  <Route path="/profile/:id" component={UserDetailedPage} />
                  <Route path="/settings" component={SettingsDashboard} />
                  <Route path="/temp" component={TemporaryComponent} />
                </Switch>
              </Container>
            </>
          )}
        />
      </>
    )
  }
}

export default App
