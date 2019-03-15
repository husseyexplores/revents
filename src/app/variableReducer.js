import { createReducer } from './common/util/reducerUtil'
import { SET_FLAG } from './variableConstants'

const initialState = {}

export function setVariableReducer(state, payload) {
  return { ...state, ...payload }
}

export default createReducer(initialState, {
  [SET_FLAG]: setVariableReducer,
})
