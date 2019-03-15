import { SubmissionError, reset } from 'redux-form'
import { toastr } from 'react-redux-toastr'
import { LOGOUT_USER } from './authConstants'
import { openModal, closeModal } from '../modals/modalActions'

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
      /* eslint-enable no-console */
      throw new SubmissionError({
        _error: error.message,
      })
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

export function registerUser(user, firestore) {
  return async (dispatch, getState, { firebase }) => {
    try {
      // create the user in firebase auth
      const createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)

      console.log(createdUser) // eslint-disable-line no-console

      // update the auth profile
      await createdUser.user.updateProfile({
        displayName: user.displayName,
      })

      // create a new profile in firestore
      const newUser = {
        displayName: createdUser.user.displayName,
        createdAt: firestore.FieldValue.serverTimestamp(),
      }

      await firestore.set(`users/${createdUser.user.uid}`, { ...newUser })
      dispatch(closeModal())
    } catch (error) {
      /* eslint-disable no-console */
      console.log('Error occured in `registerUser` action')
      console.log(error)
      /* eslint-enable no-console */
      throw new SubmissionError({
        _error: error.message,
      })
    }
  }
}

/**
 *
 * @param {String} selectedProvider - google | facebook | twitter
 * @param {Function} firestore  - Firestore instance
 */
export function socialLogin(selectedProvider, firestore) {
  return async (dispatch, getState, { firebase }) => {
    try {
      dispatch(closeModal())
      const user = await firebase.login({
        provider: selectedProvider,
        type: 'popup',
      })
      if (user.additionalUserInfo.isNewUser) {
        await firestore.set(`users/${user.user.uid}`, {
          displayName: user.profile.displayName,
          createdAt: firestore.FieldValue.serverTimestamp(),
          photoURL: user.profile.avatarUrl,
        })
      }
    } catch (error) {
      /* eslint-disable no-console */
      console.log('Error occured in `socialLogin` action')
      console.log(error)
      /* eslint-enable no-console */
    }
  }
}

/**
 *
 * @param {Object} creds - contains newPassword1 and newPassword2 (matching pwds)
 */
export function updatePassword(creds) {
  return async (dispatch, getState, { firebase }) => {
    const user = firebase.auth().currentUser
    try {
      await user.updatePassword(creds.newPassword1)

      // force blur the form before resettint
      // its causing validation errors if the form is subbmitting via `Enter`
      document.querySelector('*:focus') &&
        document.querySelector('*:focus').blur()

      await dispatch(reset('account')) // reduxForm reset form
      toastr.success('Success!', 'Your password has been updated')
    } catch (error) {
      /* eslint-disable no-console */
      console.log('Error occured in `updatePassword` action')
      console.log(error)
      /* eslint-enable no-console */
      if (error.code === 'auth/requires-recent-login') {
        // Reauth if requires login
        dispatch(
          openModal('LoginModal', {
            reauth: true,
          })
        )
      } else {
        throw new SubmissionError({
          _error: error.message,
        })
      }
    }
  }
}
