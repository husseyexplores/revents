import { LOGIN_USER, LOGOUT_USER } from './authConstants'

export function loginUser(creds) {
  return {
    type: LOGIN_USER,
    payload: {
      creds,
    },
  }
}

export function logoutUser() {
  return {
    type: LOGOUT_USER,
  }
}
