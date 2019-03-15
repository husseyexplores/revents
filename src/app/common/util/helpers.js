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
