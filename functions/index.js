const functions = require('firebase-functions')
const admin = require('firebase-admin')

// get the firebase/firestore admin permissions
admin.initializeApp(functions.config().firebase)

function newActivity(type, event, id) {
  return {
    type,
    title: event.title,
    eventDate: event.date,
    hostedBy: event.hostedBy,
    photoURL: event.hostPhotoURL,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    hostUid: event.hostUid,
    eventId: id,
  }
}

exports.createActivity = functions.firestore
  .document('events/{eventId}')
  .onCreate(event => {
    let newEvent = event.data()
    console.log('`newEvent` start')
    console.log(newEvent)
    console.log('`newEvent` end')

    const activity = newActivity('newEvent', newEvent, event.id)

    console.log('`activity` start')
    console.log(activity)
    console.log('`activity` end')

    return admin
      .firestore()
      .collection('activity')
      .add(activity)
      .then(docRef => {
        return console.log('Activity created with id:', docRef.id)
      })
      .catch(e => {
        return console.log('Error adding activity.', e)
      })
  })

exports.cancelActivity = functions.firestore
  .document('events/{eventId}')
  .onUpdate((event, context) => {
    let updatedEvent = event.after.data()
    let prevEventData = event.before.data()
    console.log({ event })
    console.log({ context })
    console.log({ updatedEvent })
    console.log({ prevEventData })

    if (
      !updatedEvent.cancelled ||
      updatedEvent.cancelled === prevEventData.cancelled
    ) {
      return false
    }

    const activity = newActivity(
      'cancelledEvent',
      updatedEvent,
      context.params.eventId
    )

    console.log({ activity })

    return admin
      .firestore()
      .collection('activity')
      .add(activity)
      .then(docRef => {
        return console.log('Activity cancelled with id:', docRef.id)
      })
      .catch(e => {
        return console.log('Error cancelling activity.', e)
      })
  })

exports.onFollowUser = functions.firestore
  .document('users/{followerUid}/following/{followingUid}')
  .onCreate((event, context) => {
    const { followerUid, followingUid } = context.params
    const followedPersonData = event.data()

    console.log({
      followerUid,
      followingUid,
      followedPersonData,
    })

    const followerDoc = admin
      .firestore()
      .collection('users')
      .doc(followerUid)

    followerDoc
      .get()
      .then(doc => {
        if (doc.exists) {
          const {
            city = 'Unknown City',
            displayName,
            photoURL = '/assets/user.png',
          } = doc.data()
          const follower = {
            city,
            displayName,
            photoURL,
          }
          console.log('Follower data:', follower)

          return admin
            .firestore()
            .collection('users')
            .doc(followingUid)
            .collection('followers')
            .doc(followerUid)
            .set(follower)
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!')
          throw new Error('Document does not exist')
        }
      })
      .catch(error => {
        console.log('Error getting document:', error)
      })
  })

exports.onUnFollowUser = functions.firestore
  .document('users/{followerUid}/following/{followingUid}')
  .onDelete((event, context) => {
    return admin
      .firestore()
      .collection('users')
      .doc(followingUid)
      .collection('followers')
      .doc(followerUid)
      .delete()
      .then(() => {
        return console.log('Follower removed. Doc deleted')
      })
      .catch(e => {
        return console.log('Error removing Follower.', e)
      })
  })
