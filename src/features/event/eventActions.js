import { toastr } from 'react-redux-toastr'
import { firestoreInstance as firestore } from '../../'

import { createNewEvent } from '../../app/common/util/helpers'
import { DELETE_EVENT, FETCH_EVENTS } from './eventConstants'

import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from '../async/asyncActions'

import { fetchSampleData } from '../data/mockAPI'

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

      toastr.success('Sucess!', 'Event has been created')
    } catch (error) {
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
  return async (dispatch, getState) => {
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

export function deleteEvent(eventId) {
  return async dispatch => {
    try {
      dispatch({ type: DELETE_EVENT, payload: { eventId } })
      toastr.success('Sucess!', 'Event has been deleted')
    } catch (error) {
      console.log(error) // eslint-disable-line no-console
    }
  }
}

export function dispatchEvents(events) {
  return {
    type: FETCH_EVENTS,
    payload: events,
  }
}

export function fetchEvents() {
  return async dispatch => {
    try {
      dispatch(asyncActionStart())
      const response = await fetchSampleData()
      dispatch(dispatchEvents(response))
      dispatch(asyncActionFinish())
    } catch (error) {
      console.log(error) // eslint-disable-line no-console
      dispatch(asyncActionError(error))
    }
  }
}
