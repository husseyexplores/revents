import { LOGIN_USER, LOGOUT_USER } from './authConstants'
import { createReducer } from '../../app/common/util/reducerUtil'

// inital login state
const initialState = {
  currentUser: {},
}

export function loginUserReducer(state, payload) {
  const { creds } = payload
  return {
    ...state,
    authenticated: true,
    currentUser: creds.email,
  }
}

export function logoutUserReducer(state) {
  return {
    ...state,
    authenticated: false,
    currentUser: {},
  }
}

export default createReducer(initialState, {
  [LOGIN_USER]: loginUserReducer,
  [LOGOUT_USER]: logoutUserReducer,
})
