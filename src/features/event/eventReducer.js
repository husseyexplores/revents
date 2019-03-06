import { createReducer } from '../../app/common/util/reducerUtil'

import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  FETCH_EVENTS,
} from './eventConstants'
import { isArray } from 'util'

const initalState = []

export function createEventReducer(state, { event }) {
  return [...state, Object.assign({}, event)]
}

export function updateEventReducer(state, { event }) {
  return state.map(evt =>
    evt.id === event.id ? Object.assign({}, event) : evt
  )
}

export function deleteEventReducer(state, { eventId }) {
  return state.filter(evt => evt.id !== eventId)
}

export function fetchEventsReducer(state, { events }) {
  if (!isArray(events)) return state
  return [...state, ...events]
}

export default createReducer(initalState, {
  [CREATE_EVENT]: createEventReducer,
  [UPDATE_EVENT]: updateEventReducer,
  [DELETE_EVENT]: deleteEventReducer,
  [FETCH_EVENTS]: fetchEventsReducer,
})
