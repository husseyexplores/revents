import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal } from 'semantic-ui-react'

import RegisterForm from '../../auth/Register/RegisterForm'

import { closeModal } from '../modalActions'

function RegisterModal({ closeModal }) {
  return (
    <Modal size="mini" open={true} onClose={closeModal}>
      <Modal.Header>Sign Up to Re-vents!</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <RegisterForm />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

RegisterModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

RegisterModal.defaultProps = {}

const mapDispatch = {
  closeModal,
}

export default connect(
  null,
  mapDispatch
)(RegisterModal)
