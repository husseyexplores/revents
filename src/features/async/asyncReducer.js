import { ASYNC_START, ASYNC_FINISH, ASYNC_ERROR } from './asyncContstants'
import { createReducer } from '../../app/common/util/reducerUtil'

const initialState = {
  isLoading: false,
}

export function asyncStartReducer(state) {
  return { ...state, isLoading: true }
}

export function asyncFinishReducer(state) {
  return { ...state, isLoading: false }
}

export function asyncErrorReducer(state) {
  return { ...state, isLoading: false }
}

export default createReducer(initialState, {
  [ASYNC_START]: asyncStartReducer,
  [ASYNC_FINISH]: asyncFinishReducer,
  [ASYNC_ERROR]: asyncErrorReducer,
})
