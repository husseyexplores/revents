import { toastr } from 'react-redux-toastr'

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
  return async dispatch => {
    try {
      dispatch({ type: CREATE_EVENT, payload: { event } })
      toastr.success('Sucess!', 'Event has been created')
    } catch (error) {
      toastr.success('Oops!', 'Something went wrong')
    }
  }
}

export function updateEvent(event) {
  return async dispatch => {
    try {
      dispatch({ type: UPDATE_EVENT, payload: { event } })
      toastr.success('Sucess!', 'Event has been updated')
    } catch (error) {
      toastr.success('Oops!', 'Something went wrong')
    }
  }
}

export function deleteEvent(eventId) {
  return async dispatch => {
    try {
      dispatch({ type: DELETE_EVENT, payload: { eventId } })
      toastr.success('Sucess!', 'Event has been deleted')
    } catch (error) {
      toastr.success('Oops!', 'Something went wrong')
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
      console.log(error)
      dispatch(asyncActionError(error))
    }
  }
}
