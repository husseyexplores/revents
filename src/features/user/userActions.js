import { toastr } from 'react-redux-toastr'
import cuid from 'cuid'
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from '../async/asyncActions'

export function updateProfile(rawUser) {
  return async (dispatch, getState, { firebase }) => {
    const { createdAt, isLoaded, isEmpty, ...user } = rawUser // eslint-disable-line no-unused-vars
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

/**
 *
 * @param {{file: string, firestore: Object}} namedParameters
 */
export function uploadProfileImage(file, firestore) {
  return async (dispatch, getState, { firebase }) => {
    const fileName = cuid()
    const user = firebase.auth().currentUser //sync method
    const path = `${user.uid}/user_images`
    const options = {
      name: fileName,
    }

    try {
      dispatch(asyncActionStart())
      // Upload the file to firebase storage
      const uploadedFile = await firebase.uploadFile(path, file, null, options)

      // Get the Url of the uploaded image
      const downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL()

      // get the user doc from firestore
      const userDoc = await firestore.get(`users/${user.uid}`)

      if (!downloadURL) {
        throw new Error('DownloadURL is missing')
      }
      if (!userDoc) {
        throw new Error('userDoc is missing')
      }
      // check if the user has photo, if not,
      // update their profile with the new image (firestore and auth profiles)
      if (!userDoc.data().photoURL) {
        // update firestore user profile doc
        await firebase.updateProfile({
          photoURL: downloadURL,
        })
        // update firebase auth profile
        await user.updateProfile({
          photoURL: downloadURL,
        })
      }

      // add the new photo to photos collection in firestore
      await firestore.add(
        {
          collection: 'users',
          doc: user.uid,
          subcollections: [{ collection: 'photos' }],
        },
        {
          name: fileName,
          url: downloadURL,
        }
      )
      dispatch(asyncActionFinish())
    } catch (error) {
      dispatch(asyncActionError())
      /* eslint-disable no-console */
      console.log('Error occured in `uploadProfileImage` action')
      console.log(error)
      throw new Error('Problem uploading photo')
      /* eslint-enable no-console */
    }
  }
}

export function deletePhoto(photo, firestore) {
  return async (dispatch, getState, { firebase }) => {
    const user = firebase.auth().currentUser //sync method

    try {
      dispatch(asyncActionStart())
      // delete the photo from firebase storage
      await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`) // rrf method

      // delete the photo doc from databse
      await firestore.delete({
        collection: 'users',
        doc: user.uid,
        subcollections: [{ collection: 'photos', doc: photo.id }],
      })
      dispatch(asyncActionFinish())
    } catch (error) {
      dispatch(asyncActionError())
      /* eslint-disable no-console */
      console.log('Error occured in `deletePhoto` action')
      console.log(error)
      throw new Error('Problem deleting the photo. Please try again.')
      /* eslint-enable no-console */
    }
  }
}

export function setMainPhoto(photoURL) {
  return async (dispatch, getState, { firebase }) => {
    try {
      dispatch(asyncActionStart())
      await firebase.updateProfile({
        photoURL,
      })
      dispatch(asyncActionFinish())
    } catch (error) {
      dispatch(asyncActionError())
      /* eslint-disable no-console */
      console.log('Error occured in `setMainPhoto` action')
      console.log(error)
      throw new Error('Problem setting the main photo. Please try again.')
      /* eslint-enable no-console */
    }
  }
}
