import { LOGIN_USER, LOGOUT_USER } from './authConstants'
import { closeModal } from '../modals/modalActions'

export function loginUser(creds) {
  return async dispatch => {
    try {
      await dispatch({ type: LOGIN_USER, payload: { creds } })
      dispatch(closeModal())
    } catch (error) {
      /* eslint-disable no-console */
      console.log('Error occured in `loginUser` action ')
      /* eslint-enable no-console */
    }
  }
}

export function logoutUser() {
  return {
    type: LOGOUT_USER,
  }
}
