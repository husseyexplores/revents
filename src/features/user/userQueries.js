export function userDetailedQuery(props) {
  const { curProfileUserUid, isCurrentUser, signedInUserUid } = props

  if (!isCurrentUser) {
    return [
      {
        collection: 'users',
        doc: curProfileUserUid,
        storeAs: 'profile',
      },
      {
        collection: 'users',
        doc: curProfileUserUid,
        subcollections: [{ collection: 'photos' }],
        storeAs: 'photos',
      },
      {
        collection: 'users',
        doc: signedInUserUid,
        subcollections: [{ collection: 'following' }],
        storeAs: 'following',
      },
    ]
  }

  return [
    {
      collection: 'users',
      doc: curProfileUserUid,
      subcollections: [{ collection: 'photos' }],
      storeAs: 'photos',
    },
  ]
}

export function peopleDashboardQuery(props) {
  const { userUid } = props
  return [
    {
      collection: 'users',
      doc: userUid,
      subcollections: [{ collection: 'following' }],
      storeAs: 'following',
    },
    {
      collection: 'users',
      doc: userUid,
      subcollections: [{ collection: 'followers' }],
      storeAs: 'followers',
    },
  ]
}
