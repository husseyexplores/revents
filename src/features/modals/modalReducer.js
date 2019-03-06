import { MODAL_OPEN, MODAL_CLOSE } from './modalConstants'

import { createReducer } from '../../app/common/util/reducerUtil'

const initialState = null

export function openModalReducer(state, payload) {
  const { modalType, modalProps } = payload
  return { modalType, modalProps }
}

export function closeModalReducer() {
  return null
}

export default createReducer(initialState, {
  [MODAL_OPEN]: openModalReducer,
  [MODAL_CLOSE]: closeModalReducer,
})
