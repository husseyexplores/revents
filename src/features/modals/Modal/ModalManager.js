import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import TestModal from './TestModal'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

// Lookup/Map
const modalMap = {
  TestModal,
  LoginModal,
  RegisterModal,
}

function ModalManager({ currentModal }) {
  if (!currentModal) return null

  const { modalType, modalProps } = currentModal
  const ModalComponent = modalMap[modalType]

  return <ModalComponent {...modalProps} />
}

ModalManager.propTypes = {
  currentModal: PropTypes.object,
}

ModalManager.defaultProps = {}

function mapState(state) {
  return {
    currentModal: state.modals,
  }
}

export default connect(
  mapState,
  null
)(ModalManager)
