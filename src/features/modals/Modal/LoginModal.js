import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal } from 'semantic-ui-react'

import LoginForm from '../../auth/Login/LoginForm'

import { closeModal } from '../modalActions'

function LoginModal({ closeModal }) {
  return (
    <Modal size="mini" open={true} onClose={closeModal}>
      <Modal.Header>Login to Re-vents</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <LoginForm />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

LoginModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

LoginModal.defaultProps = {}

const mapDispatch = {
  closeModal,
}

export default connect(
  null,
  mapDispatch
)(LoginModal)
