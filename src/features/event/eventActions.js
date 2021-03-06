import { toastr } from 'react-redux-toastr'
import compareDateAsc from 'date-fns/compare_asc'
import { firestoreInstance as firestore } from '../../'

import { createNewEvent } from '../../app/common/util/helpers'
import { FETCH_EVENTS_DB } from './eventConstants'
import { setDbLastEventId, setDbHasMoreEvents } from '../../app/variableActions'

import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from '../async/asyncActions'
import { firestoreErrMsg } from '../../app/common/util/helpers'

export function createEvent(event) {
  return async (dispatch, getState, { firebase }) => {
    let date = event.date
    if (typeof date === 'string') {
      // convert this: "1971-08-26 05:30" to JS Date object
      date = new Date(date)
    } else if (
      date instanceof Object &&
      date.constructor.name === 'Timestamp'
    ) {
      date = date.toDate()
    }

    const user = firebase.auth().currentUser
    const photoURL = getState().firebase.profile.photoURL || '/assets/user.png'
    const newEvent = createNewEvent(user, photoURL, {
      ...event,
      date,
    })

    try {
      dispatch(asyncActionStart())
      // create new event in firestore
      const createdEvent = await firestore.add(`events`, newEvent)

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
      console.log({ error }) // eslint-disable-line no-console
      toastr.error('Oops!', 'Something went wrong')
    }
  }
}

export function updateEvent(event) {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart())
    let date = event.date
    if (typeof date === 'string') {
      // convert this: "1971-08-26 05:30" to JS Date object
      date = new Date(date)
    }

    try {
      const eventDateTimestamp = getState().firestore.ordered.events[0].date
      const eventDocRef = firestore.collection('events').doc(event.id)
      const dateEqual = compareDateAsc(eventDateTimestamp.toDate(), date)
      if (dateEqual !== 0) {
        const batch = firestore.batch()
        await batch.update(eventDocRef, { ...event, date })

        const eventAttendeeRef = firestore.collection('event_attendee')
        const eventAttendeeQuery = eventAttendeeRef.where(
          'eventId',
          '==',
          event.id
        )
        const eventAttendeeQuerySnap = await eventAttendeeQuery.get()

        for (let i = 0; i < eventAttendeeQuerySnap.docs.length; i++) {
          const docRef = firestore
            .collection('event_attendee')
            .doc(eventAttendeeQuerySnap.docs[i].id)
          await batch.update(docRef, {
            eventDate: date,
          })
        }

        await batch.commit()
      } else {
        await eventDocRef.update({ ...event, date })
      }

      dispatch(asyncActionFinish())
      toastr.success('Success!', 'Event has been updated')
    } catch (error) {
      dispatch(asyncActionError())
      console.log({ error }) // eslint-disable-line no-console

      const errMsg = firestoreErrMsg(error, {
        fallback: 'Problem update event. Please try again',
      })
      toastr.error('Oops!', errMsg)
    }
  }
}

export function eventCancelToggle(cancelled, eventId) {
  return async () => {
    const message = cancelled
      ? 'Are you sure you want to cancel the event?'
      : 'Are you sure you want to Reactivate the event?'

    toastr.confirm(message, {
      onOk: async () => {
        try {
          await firestore.update(`events/${eventId}`, { cancelled })
          const msg = cancelled ? 'Event cancelled' : 'Event reactivated'
          toastr.success('Success!', msg)
        } catch (error) {
          const errMsg = firestoreErrMsg(error, {
            fallback: 'Some problem occured. Please try again',
          })
          toastr.error('Oops!', errMsg)
        }
      },
    })
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
      console.log({ error }) // eslint-disable-line no-console
      toastr.error('Oops!', 'Something went wrong')
    }
  }
}

export function addEventComment(eventId, values, parentId) {
  return async (dispatch, getState, { firebase }) => {
    const { profile } = getState().firebase
    const user = firebase.auth().currentUser
    const newComment = {
      displayName: profile.displayName,
      photoURL: profile.photoURL || '/assets/user.png',
      uid: user.uid,
      text: values.comment.trim(),
      date: Date.now(),
      parentId,
    }
    try {
      await firebase.push(`event_chat/${eventId}`, newComment)
    } catch (error) {
      console.log('Error occured in `addEventComment` action') // eslint-disable-line no-console
      console.log({ error }) // eslint-disable-line no-console
      toastr.error('Oops!', 'Problem adding comment')
    }
  }
}
