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

export const createDataTree = dataset => {
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
