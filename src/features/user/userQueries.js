export function userDetailedQuery(props) {
  const { userUid, isCurrentUser } = props

  if (!isCurrentUser) {
    return [
      {
        collection: 'users',
        doc: userUid,
        storeAs: 'profile',
      },
      {
        collection: 'users',
        doc: userUid,
        subcollections: [{ collection: 'photos' }],
        storeAs: 'photos',
      },
    ]
  }

  return [
    {
      collection: 'users',
      doc: userUid,
      subcollections: [{ collection: 'photos' }],
      storeAs: 'photos',
    },
  ]
}
