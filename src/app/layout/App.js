import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'

import NavBar from '../../features/nav/NavBar/NavBar'
import EventDashBoard from '../../features/event/EventDashboard/EventDashBoard'

class App extends Component {
  render() {
    return (
      <>
        <NavBar />
        <Container className="main">
          <EventDashBoard />
        </Container>
      </>
    )
  }
}

export default App
