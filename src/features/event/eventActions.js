import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  FETCH_EVENTS,
} from './eventConstants'

import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from '../async/asyncActions'

import { fetchSampleData } from '../data/mockAPI'

export function createEvent(event) {
  return {
    type: CREATE_EVENT,
    payload: {
      event,
    },
  }
}

export function updateEvent(event) {
  return {
    type: UPDATE_EVENT,
    payload: {
      event,
    },
  }
}

export function deleteEvent(eventId) {
  return {
    type: DELETE_EVENT,
    payload: {
      eventId,
    },
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
      console.log(error)
      dispatch(asyncActionError(error))
    }
  }
}
