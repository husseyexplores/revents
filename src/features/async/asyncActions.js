import { ASYNC_START, ASYNC_FINISH, ASYNC_ERROR } from './asyncContstants'

export function asyncActionStart() {
  return {
    type: ASYNC_START,
  }
}

export function asyncActionFinish() {
  return {
    type: ASYNC_FINISH,
  }
}

export function asyncActionError(error) {
  return {
    type: ASYNC_ERROR,
    error,
  }
}
