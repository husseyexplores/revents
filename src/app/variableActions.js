import { SET_FLAG } from './variableConstants'

export function setDbLastEventId(id) {
  return { type: SET_FLAG, payload: { dbLastEventId: id } }
}

export function setDbHasMoreEvents(boolVal) {
  return { type: SET_FLAG, payload: { dbHasMoreEvents: boolVal } }
}
