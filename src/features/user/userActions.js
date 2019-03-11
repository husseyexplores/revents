import { toastr } from 'react-redux-toastr'

export function updateProfile(rawUser) {
  return async (dispatch, getState, { firebase }) => {
    const { createdAt, isLoaded, isEmpty, ...user } = rawUser
    if (user.dateOfBirth) {
      user.dateOfBirth = new Date(user.dateOfBirth)
    }
    console.log(rawUser)
    console.log(user)
    try {
      // we're updating out firestore user document
      // this `updateProfile` method is specific to react-redux-firebase lib, not firebase official lib
      await firebase.updateProfile(user)
      toastr.success('Success!', 'Profile updated')
    } catch (error) {
      /* eslint-disable no-console */
      console.log('Error occured in `updateProfile` action')
      console.log(error)
      /* eslint-enable no-console */
    }
  }
}
