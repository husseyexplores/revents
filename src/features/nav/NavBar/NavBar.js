import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'
import { NavLink, Link, withRouter } from 'react-router-dom'
import { Menu, Container, Button } from 'semantic-ui-react'

import SignedInMenu from '../Menus/SignedInMenu'
import SignedOutMenu from '../Menus/SignedOutMenu'

import { openModal } from '../../modals/modalActions'
import { logoutUser } from '../../auth/authActions'

class NavBar extends Component {
  handleSignIn = () => {
    this.props.openLoginModal()
  }

  handleRegister = () => {
    this.props.openRegisterModal()
  }

  handleSignOut = () => {
    const { logoutUser, history } = this.props
    logoutUser()
    history.push('/')
  }

  render() {
    const { auth, profile } = this.props
    const { currentUser } = auth
    const authenticated = auth.isLoaded && !auth.isEmpty

    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={Link} to="/" header>
            <img src="/assets/logo.png" alt="logo" />
            Re-vents
          </Menu.Item>
          <Menu.Item as={NavLink} to="/events" name="Events" />
          {authenticated && (
            <Menu.Item as={NavLink} to="/people" name="People" />
          )}
          {authenticated && (
            <Menu.Item>
              <Button
                as={Link}
                to="/create-event"
                floated="right"
                positive
                inverted
                content="Create Event"
              />
            </Menu.Item>
          )}
          {authenticated ? (
            <SignedInMenu
              handleSignOut={this.handleSignOut}
              profile={profile}
            />
          ) : (
            <SignedOutMenu
              handleSignIn={this.handleSignIn}
              handleRegister={this.handleRegister}
            />
          )}
        </Container>
      </Menu>
    )
  }
}

NavBar.propTypes = {
  history: PropTypes.object.isRequired,
  openLoginModal: PropTypes.func.isRequired,
  openRegisterModal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object,
  logoutUser: PropTypes.func.isRequired,
}

NavBar.defaultProps = {}

function mapState(state) {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  }
}

function mapDispatch(dispatch) {
  return {
    openLoginModal: props => dispatch(openModal('LoginModal', props)),
    openRegisterModal: props => dispatch(openModal('RegisterModal', props)),
    logoutUser: () => dispatch(logoutUser()),
  }
}

const navWithRedux = connect(
  mapState,
  mapDispatch
)(NavBar)

export default withRouter(withFirebase(navWithRedux))
