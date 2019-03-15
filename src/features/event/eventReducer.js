import { createReducer } from '../../app/common/util/reducerUtil'

import {
  UPDATE_EVENT,
  FETCH_EVENTS_DB,
  FETCH_EVENTS_UP,
} from './eventConstants'
import { isArray } from 'util'

const initalState = {
  dashboard: [],
  userProfile: [],
}

export function updateEventReducer(state, { event }) {
  const updatedEvents = state.dashboard.map(evt =>
    evt.id === event.id ? Object.assign({}, event) : evt
  )
  return { ...state, dashboard: updatedEvents }
}

export function fetchDBEventsReducer(state, { events, noMerge = false }) {
  if (!isArray(events)) return state

  if (noMerge) {
    return { ...state, dashboard: events }
  }

  const updatedEvents = [...state.dashboard, ...events]
  return { ...state, dashboard: updatedEvents }
}

export function fetchUPEventsReducer(state, { events, noMerge = false }) {
  if (!isArray(events)) return state

  if (noMerge) {
    return { ...state, userProfile: events }
  }

  const updatedEvents = [...state.userProfile, ...events]
  return { ...state, userProfile: updatedEvents }
}

export default createReducer(initalState, {
  [UPDATE_EVENT]: updateEventReducer,
  [FETCH_EVENTS_DB]: fetchDBEventsReducer,
  [FETCH_EVENTS_UP]: fetchUPEventsReducer,
})
