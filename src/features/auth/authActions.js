import { SubmissionError } from 'redux-form'
import { LOGIN_USER, LOGOUT_USER } from './authConstants'
import { closeModal } from '../modals/modalActions'

export function loginUser(creds) {
  return async (dispatch, getState, { firebase }) => {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(creds.email, creds.password)
      dispatch(closeModal())
    } catch (error) {
      /* eslint-disable no-console */
      console.log('Error occured in `loginUser` action')
      console.log(error)
      throw new SubmissionError({
        _error: error.message,
      })
      /* eslint-enable no-console */
    }
  }
}

export function logoutUser() {
  return async (dispatch, getState, { firebase }) => {
    try {
      await firebase.logout()
      dispatch({ type: LOGOUT_USER })
    } catch (error) {
      /* eslint-disable no-console */
      console.log('Error occured in `logoutUser` action')
      console.log(error)
      /* eslint-enable no-console */
    }
  }
}
