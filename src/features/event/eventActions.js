import { toastr } from 'react-redux-toastr'
import { firestoreInstance as firestore } from '../../'

import { createNewEvent } from '../../app/common/util/helpers'
import { FETCH_EVENTS_DB } from './eventConstants'
import { setDbLastEventId, setDbHasMoreEvents } from '../../app/variableActions'

import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from '../async/asyncActions'

export function createEvent(event) {
  return async (dispatch, getState, { firebase }) => {
    let date = event.date
    if (typeof event.date === 'string') {
      // convert this: "1971-08-26 05:30" to JS Date object
      date = new Date(date)
    }

    const user = firebase.auth().currentUser
    const photoURL = getState().firebase.profile.photoURL
    const newEvent = createNewEvent(user, photoURL, event)

    try {
      dispatch(asyncActionStart())
      // create new event in firestore
      const createdEvent = await firestore.add(`events`, {
        ...newEvent,
        date: date,
      })

      // create new events lookup table for queries - no sqql db stuff
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: date,
        host: true,
      })

      dispatch(asyncActionFinish())
      toastr.success('Sucess!', 'Event has been created')
    } catch (error) {
      dispatch(asyncActionError())
      console.log(error) // eslint-disable-line no-console
      toastr.error('Oops!', 'Something went wrong')
    }
  }
}

export function updateEvent(event) {
  return async () => {
    let date = event.date
    if (typeof event.date === 'string') {
      // convert this: "1971-08-26 05:30" to JS Date object
      date = new Date(date)
    }

    try {
      await firestore.update(`events/${event.id}`, { ...event, date })
      toastr.success('Sucess!', 'Event has been updated')
    } catch (error) {
      console.log(error) // eslint-disable-line no-console
      toastr.error('Oops!', 'Something went wrong')
    }
  }
}

export function eventCancelToggle(cancelled, eventId) {
  return async () => {
    const message = cancelled
      ? 'Are you sure you want to cancel the event?'
      : 'Are you sure you want to Reactivate the event?'
    try {
      toastr.confirm(message, {
        onOk: () => {
          firestore.update(`events/${eventId}`, {
            cancelled,
          })
        },
      })
    } catch (error) {
      console.log(error) // eslint-disable-line no-console
      toastr.error('Oops!', 'Something went wrong')
    }
  }
}

export function getEventsForDashboard() {
  return async (dispatch, getState, { firebase }) => {
    const existingEvents = getState().events.dashboard
    const lastEvent =
      (existingEvents.length && existingEvents[existingEvents.length - 1]) || {}

    const today = new Date(Date.now())
    // default firebase instance (not hooked to react-redux-firebase)
    const firestore = firebase.firestore()
    const eventsRef = firestore.collection('events')
    const baseQuery = eventsRef
      .where('date', '>=', today)
      .orderBy('date')
      .limit(2)

    try {
      dispatch(asyncActionStart())

      const startAfter =
        lastEvent.id &&
        (await firestore
          .collection('events')
          .doc(lastEvent.id)
          .get())
      const query = lastEvent.id ? baseQuery.startAfter(startAfter) : baseQuery

      const querySnap = await query.get()

      if (querySnap && querySnap.docs && querySnap.docs.length > 1) {
        dispatch(setDbHasMoreEvents(true))
      } else if (querySnap && querySnap.docs && querySnap.docs.length <= 1) {
        dispatch(setDbHasMoreEvents(false))
      }

      if (querySnap.docs.length === 0) {
        dispatch(setDbLastEventId(lastEvent.id))
        dispatch(asyncActionFinish())
        return querySnap
      }

      const events = []

      for (let i = 0; i < querySnap.docs.length; i++) {
        const event = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id }
        events.push(event)
      }

      dispatch({ type: FETCH_EVENTS_DB, payload: { events } })
      dispatch(setDbLastEventId(lastEvent.id))
      dispatch(asyncActionFinish())
      return querySnap
    } catch (error) {
      dispatch(asyncActionError())
      console.log('Error occured in `getEventsForDashboard` action') // eslint-disable-line no-console
      console.log(error) // eslint-disable-line no-console
      toastr.error('Oops!', 'Something went wrong')
    }
  }
}
