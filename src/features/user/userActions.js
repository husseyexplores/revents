import { toastr } from 'react-redux-toastr'
import cuid from 'cuid'
import { firestoreInstance as firestore } from '../../'

import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from '../async/asyncActions'
import { FETCH_EVENTS_UP } from '../event/eventConstants'
import { firestoreErrMsg } from '../../app/common/util/helpers'

export function updateProfile(rawUser) {
  return async (dispatch, getState, { firebase }) => {
    const { createdAt, isLoaded, isEmpty, ...user } = rawUser // eslint-disable-line no-unused-vars
    if (user.dateOfBirth.constructor.name === 'Timestamp') {
      user.dateOfBirth = user.dateOfBirth.toDate()
    } else {
      user.dateOfBirth = new Date(user.dateOfBirth)
    }

    try {
      // we're updating out firestore user document
      // this `updateProfile` method is specific to react-redux-firebase lib, not firebase official lib
      await firebase.updateProfile(user)
      toastr.success('Success!', 'Profile updated')
    } catch (error) {
      /* eslint-disable no-console */
      console.log('Error occured in `updateProfile` action')
      console.log({ error })
      const errMsg = firestoreErrMsg(error, {
        fallback: 'Some problem occured. Please try again',
        feedback: 'Please try again',
      })
      toastr.error('Oops', errMsg)
      /* eslint-enable no-console */
    }
  }
}

/**
 *
 * @param {{file: string, firestore: Object}} namedParameters
 */
export function uploadProfileImage(file) {
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
      toastr.success('Success', 'Photo has been uploaded')
    } catch (error) {
      dispatch(asyncActionError())
      /* eslint-disable no-console */
      console.log('Error occured in `uploadProfileImage` action')
      console.log({ error })
      const errMsg = firestoreErrMsg(error, {
        fallback: 'Problem uploading photo. Please try again.',
      })
      toastr.error('Oops', errMsg)
      /* eslint-enable no-console */
    }
  }
}

export function deletePhoto(photo) {
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
      toastr.success('Success!', 'Photo has been deleted')
    } catch (error) {
      dispatch(asyncActionError())
      /* eslint-disable no-console */
      console.log('Error occured in `deletePhoto` action')
      console.log({ error })
      throw new Error('Problem deleting the photo. Please try again.')
      /* eslint-enable no-console */
    }
  }
}

export function setMainPhoto(photoURL) {
  return async (dispatch, getState, { firebase }) => {
    dispatch(asyncActionStart())
    const user = firebase.auth().currentUser
    const updateFromDate = new Date('2018')
    const userDocRef = firestore.collection('users').doc(user.uid)
    const eventAttendeeRef = firestore.collection('event_attendee')
    const activityRef = firestore.collection('activity')

    try {
      const batch = firestore.batch()
      await batch.update(userDocRef, {
        photoURL,
      })

      const eventQuery = await eventAttendeeRef
        .where('userUid', '==', user.uid)
        .where('eventDate', '>=', updateFromDate)
      const eventQuerySnap = await eventQuery.get()

      for (let i = 0; i < eventQuerySnap.docs.length; i++) {
        const eventDocRef = await firestore
          .collection('events')
          .doc(eventQuerySnap.docs[i].data().eventId)
        const event = await eventDocRef.get()
        if (event.data().hostUid === user.uid) {
          batch.update(eventDocRef, {
            hostPhotoURL: photoURL,
            [`attendees.${user.uid}.photoURL`]: photoURL,
          })
        } else {
          batch.update(eventDocRef, {
            [`attendees.${user.uid}.photoURL`]: photoURL,
          })
        }
      }

      const activityQuery = await activityRef.where('hostUid', '==', user.uid)
      const activityQuerySnap = await activityQuery.get()

      for (let i = 0; i < activityQuerySnap.docs.length; i++) {
        const activityDocRef = await firestore
          .collection('activity')
          .doc(activityQuerySnap.docs[i].id)

        batch.update(activityDocRef, {
          photoURL,
        })
      }

      await batch.commit()
      // await firebase.updateProfile({
      //   photoURL,
      // })
      dispatch(asyncActionFinish())
      toastr.success('Success!', 'Photo has been uploaded')
    } catch (error) {
      dispatch(asyncActionError())
      /* eslint-disable no-console */
      console.log('Error occured in `setMainPhoto` action')
      console.log({ error })

      const errMsg = firestoreErrMsg(error, {
        fallback: 'Problem signing up to event. Please try again',
      })
      toastr.error('Oops', errMsg)
      /* eslint-enable no-console */
    }
  }
}

export function goingToEvent(event) {
  return async (dispatch, getState, { firebase }) => {
    const user = firebase.auth().currentUser
    // can't rely with AUTH photo, it doesn't update very frequently
    const photoURL = getState().firebase.profile.photoURL
    const attendee = {
      host: false,
      going: true,
      joinDate: new Date(Date.now()),
      photoURL: photoURL || null,
      displayName: user.displayName,
    }

    const attendeeLookup = {
      eventId: event.id,
      userUid: user.uid,
      eventDate: new Date(event.date),
      host: false,
    }

    try {
      dispatch(asyncActionStart())
      const eventDocRef = firestore.collection('events').doc(event.id)
      // get the ref of the doc that WILL be created
      const eventAttendeeDocRef = firestore
        .collection('event_attendee')
        .doc(`${event.id}_${user.uid}`)

      await firestore.runTransaction(async transaction => {
        await transaction.get(eventDocRef)
        await transaction.update(eventDocRef, {
          [`attendees.${user.uid}`]: attendee,
        })
        await transaction.set(eventAttendeeDocRef, attendeeLookup)
      })

      dispatch(asyncActionFinish())
      toastr.success('Success!', 'You have signed up to the event')
    } catch (error) {
      dispatch(asyncActionError())
      /* eslint-disable no-console */
      console.log('Error occured in `goingToEvent` action')
      console.log({ error })

      const errMsg = firestoreErrMsg(error, {
        fallback: 'Problem signing up to event. Please try again',
      })
      toastr.error('Oops!', errMsg)
      /* eslint-enable no-console */
    }
  }
}

export function cancelGoingToEvent(event) {
  return async (dispatch, getState, { firebase }) => {
    const user = firebase.auth().currentUser

    try {
      dispatch(asyncActionStart())
      // create a new attendee entry in this doc:
      // `events<doc>/[event.id]<doc> => attendees.[user.uid]<object>`
      await firestore.update(`events/${event.id}`, {
        // computed key
        // that's how we delete individual field in firestore
        [`attendees.${user.uid}`]: firestore.FieldValue.delete(),
      })

      // add user to events lookup table for queries - no sqql db stuff
      // `event_attendee<doc>/[event.id]_[user.uid]<doc>` => attendeeLookup
      // that's how we delete a doc in firestore
      await firestore.delete(`event_attendee/${event.id}_${user.uid}`)

      dispatch(asyncActionFinish())
      toastr.success('Success!', 'You have removed yourself from the event')
    } catch (error) {
      dispatch(asyncActionError())
      /* eslint-disable no-console */
      console.log('Error occured in `cancelGoingToEvent` action')
      console.log({ error })
      toastr.error('Oops!', 'Something went wrong')
      /* eslint-enable no-console */
    }
  }
}

export function getUserEvents(userUid, activeTab) {
  return async (dispatch, getState, { firebase }) => {
    dispatch(asyncActionStart())
    const today = new Date(Date.now())
    const eventsRef = firestore
      .collection('event_attendee')
      .where('userUid', '==', userUid)

    let query

    switch (activeTab) {
      case 1: // past events
        query = eventsRef
          .where('eventDate', '<=', today)
          .orderBy('eventDate', 'desc')
        break
      case 2: // future events
        query = eventsRef.where('eventDate', '>=', today).orderBy('eventDate')
        break
      case 3: // host events
        query = eventsRef.where('host', '==', true).orderBy('eventDate', 'desc')
        break
      default:
        // all events
        query = eventsRef.orderBy('eventDate', 'desc')
    }

    try {
      const querySnap = await query.get()
      const events = []

      for (let i = 0; i < querySnap.docs.length; i++) {
        const event = await firestore
          .collection('events')
          .doc(querySnap.docs[i].data().eventId)
          .get()
        events.push({ ...event.data(), id: event.id })
      }
      dispatch({ type: FETCH_EVENTS_UP, payload: { events, noMerge: true } })

      dispatch(asyncActionFinish())
      return querySnap
    } catch (error) {
      dispatch(asyncActionError())
      /* eslint-disable no-console */
      console.log('Error occured in `getUserEvents` action')
      console.log({ error })
      /* eslint-enable no-console */
    }
  }
}

/* eslint-disable no-console */
export function followUser(userToFollowId) {
  return async (dispatch, getState, { firebase }) => {
    // signed-in user info, the one who clicked on `follow` button
    const user = firebase.auth().currentUser

    try {
      // fetch userToFollow data
      const userToFollow = await firestore.get(`users/${userToFollowId}`) // doc

      const {
        displayName,
        photoURL,
        city = 'Unknown city',
      } = userToFollow.data()

      // in the signed-in user's doc, create a doc in this sub collection:
      // `users<doc>/following<doc>` => attendeeLookup
      await firestore.set(`users/${user.uid}/following/${userToFollowId}`, {
        city,
        displayName,
        photoURL,
      })

      toastr.success('Success!', `You are now following ${displayName}`)
    } catch (error) {
      toastr.error('Oops!', 'Some error occurred')
      console.log('Error occured in `followUser` action')
      console.log({ error })
    }
  }
}

export function unFollowUser(userToUnfollowId) {
  return async (dispatch, getState, { firebase }) => {
    // signed-in user info, the one who clicked on `unfollow` button
    const user = firebase.auth().currentUser

    try {
      // fetch userToUnFollow data
      const userToUnFollow = await firestore.get(`users/${userToUnfollowId}`) // doc

      const { displayName } = userToUnFollow.data()

      // delete the doc from `following` in firestore
      await firestore.delete({
        collection: 'users',
        doc: user.uid,
        subcollections: [{ collection: 'following', doc: userToUnfollowId }],
      })

      toastr.success('Success!', `You unfollowed ${displayName}`)
    } catch (error) {
      toastr.error('Oops!', 'Some error occurred')
      console.log('Error occured in `unFollowUser` action')
      console.log({ error })
    }
  }
}
