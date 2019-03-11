import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal } from 'semantic-ui-react'

import LoginForm from '../../auth/Login/LoginForm'

import { closeModal } from '../modalActions'

function LoginModal({ closeModal, reauth, ...restProps }) {
  const title = reauth
    ? 'Please reauthenticate to Re-vents'
    : 'Login to Re-vents'
  return (
    <Modal size="mini" open={true} onClose={closeModal}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <LoginForm reauth={reauth} {...restProps} />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

LoginModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  reauth: PropTypes.bool,
}

LoginModal.defaultProps = {}

const mapDispatch = {
  closeModal,
}

export default connect(
  null,
  mapDispatch
)(LoginModal)
