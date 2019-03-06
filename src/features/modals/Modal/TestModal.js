/**
 * This is a test modal
 * This should not exist in production
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal } from 'semantic-ui-react'

import { closeModal } from '../modalActions'

function TestModal({ closeModal }) {
  return (
    <Modal closeIcon="close" open={true} onClose={closeModal}>
      <Modal.Header>Test Modal</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>Test Modal... nothing to see here</p>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

TestModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

TestModal.defaultProps = {}

const mapDispatch = {
  closeModal,
}

export default connect(
  null,
  mapDispatch
)(TestModal)
