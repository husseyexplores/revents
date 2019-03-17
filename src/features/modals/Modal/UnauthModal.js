import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Modal, Button, Divider } from 'semantic-ui-react'

import { openModal, closeModal } from '../modalActions'

function UnauthModal({ closeModal, openModal, history, goBack }) {
  function handleCloseModal() {
    goBack && history.goBack()
    closeModal()
  }

  return (
    <Modal size="mini" open={true} onClose={handleCloseModal}>
      <Modal.Header>You need to be signed in to do that!</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>Please either login or register to see this page</p>
          <Button.Group widths={4}>
            <Button fluid color="teal" onClick={() => openModal('LoginModal')}>
              Login
            </Button>
            <Button.Or />
            <Button fluid positive onClick={() => openModal('RegisterModal')}>
              Register
            </Button>
          </Button.Group>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <p>Or click cancel to continue as a guest</p>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </div>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

UnauthModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  goBack: PropTypes.bool.isRequired,
}

UnauthModal.defaultProps = {
  goBack: true,
}

const mapDispatch = {
  closeModal,
  openModal,
}

export default withRouter(
  connect(
    null,
    mapDispatch
  )(UnauthModal)
)
