export function createNewEvent(user, photoURL, event) {
  // Firebase event schema
  return {
    ...event,
    date: new Date(event.date), // convert to date object from dateFns
    hostedBy: user.displayName,
    hostUid: user.uid,
    hostPhotoURL: photoURL || '/assets/uesr.png',
    createdAt: Date.now(),
    attendees: {
      [user.uid]: {
        host: true,
        going: true,
        joinDate: new Date(Date.now()),
        photoURL: photoURL || '/assets/uesr.png',
        displayName: user.displayName,
      },
    },
  }
}

export function objectToArray(object) {
  if (object && typeof object === 'object') {
    return Object.entries(object).map(e =>
      Object.assign({}, { ...e[1], id: e[0] })
    )
  }
}

export function createDataTree(dataset) {
  // `dataset` will be a flat array as in our firebase comments
  const hashTable = Object.create(null)
  dataset.forEach(a => (hashTable[a.id] = { ...a, childNodes: [] }))
  const dataTree = []
  dataset.forEach(a => {
    if (a.parentId) hashTable[a.parentId].childNodes.push(hashTable[a.id])
    else dataTree.push(hashTable[a.id])
  })
  return dataTree
}

/**
 *
 * @param {Object} e - error message
 * @param {{fallback: 'string', feedback: 'string', onlyCustom: Boolean}} customizeResponse - Object to customize error response
 */
export function firestoreErrMsg(
  e,
  { fallback = 'Something went wrong', feedback, onlyCustom = false } = {}
) {
  const errMap = {
    unauthenticated: 'Please sign-in to perform this action',
    'permission-denied': 'Permission denied',
    'not-found': 'Resource not found',
    cancelled: 'Operation cancelled',
    'deadline-exceeded': 'Server timeout. Please try again',
    aborted: 'Operation interupted. Please try again',
    unavailable:
      'Sorry! This operation in unavailable. Please try again later.',
  }

  if (!onlyCustom && e.code && errMap.hasOwnProperty(e.code)) {
    return feedback ? errMap[e.code] + '. ' + feedback : errMap[e.code]
  }

  return fallback
}
