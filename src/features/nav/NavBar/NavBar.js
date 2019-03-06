import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
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
    const { auth } = this.props
    const { authenticated, currentUser } = auth

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
              currentUser={currentUser}
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
  openLoginModal: PropTypes.func.isRequired,
  openRegisterModal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
}

NavBar.defaultProps = {}

function mapState(state) {
  return {
    auth: state.auth,
  }
}

function mapDispatch(dispatch) {
  return {
    openLoginModal: props => dispatch(openModal('LoginModal', props)),
    openRegisterModal: props => dispatch(openModal('LoginModal', props)),
    logoutUser: () => dispatch(logoutUser()),
  }
}

const navWithRedux = connect(
  mapState,
  mapDispatch
)(NavBar)

export default withRouter(navWithRedux)
