export function createNewEvent(user, photoURL, event) {
  // Firebase event schema
  return {
    ...event,
    date: new Date(event.date),
    hostedBy: user.displayName,
    hostUid: user.uid,
    hostPhotoURL: photoURL || '/assets/uesr.png',
    createdAt: new Date(Date.now()),
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

export function makeSpreadable(value) {
  return Array.isArray(value) ? value : [value]
}

/**
 *
 * @param {Object} options - options object
 * @param {Array.<string>} [options.fields=[]] - Array of fields/keys to normalize
 * @param {boolean} [options.deep=false] - Deep normalize?
 * @returns {Function} return a function that accepts the data to normalize
 * @returns {Array.<Object>} return the normalized data as an array of objects
 */
export function normalizeFirestoreData({ fields = [], deep = false } = {}) {
  return data => {
    if (!data)
      throw new Error('`normalizeFirestoreData` needs some data to work on!')

    let _normalized

    if (Array.isArray(data)) {
      _normalized = [...data]
    } else {
      _normalized = { ...data }
      if (!_normalized.id) _normalized = objectToArray(_normalized)
    }

    if (Array.isArray(fields) && fields.length > 0) {
      for (let j = 0; j < _normalized.length; j++) {
        for (let _value, i = 0; i < fields.length; i++, _value = null) {
          _value = _normalized[j][fields[i]]

          if (_value instanceof Object) {
            // convert firestore Timestamp to JS Date object
            if (_value.constructor.name === 'Timestamp') {
              _value = _value.toDate()
              _normalized[j][fields[i]] = _value
              continue
            } else {
              // normalize nested objectes into array
              if (!_value.id) {
                _value = objectToArray(_value)
              }

              if (deep) {
                _value = normalizeFirestoreData(_value, fields)
              }

              _normalized[j][fields[i]] = _value
              continue
            }
          }
        }
      }
    }

    return _normalized
  }
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

/**
 *
 * @param {Object} firestoreQuery - Path to firebase db collection
 * @param {string} firestoreQuery.collection - Path to firebase db collection
 * @param {string} firestoreQuery.doc - Path to firebase db collection
 * @param {Array.<string>} firestoreQuery.where - Path to firebase db collection
 * @param {Object} firestore - Firestore Instance
 */
export function getFirestoreRefObject(firestoreQuery, firestore) {
  let ref = firestore
  function makeSpreadable(value) {
    return Array.isArray(value) ? value : [value]
  }
  // build the firestoreQuery
  for (const _key in firestoreQuery) {
    let _value = firestoreQuery[_key]
    _value = makeSpreadable(_value)
    ref = ref[_key](..._value)
  }
  return ref
}
// getRef({collection: 'events', doc: '213412'})

/**
 *
 * @param {string} firestoreQuery - Path to firebase db collection
 * @param {Object} firestore - Firestore Instance
 */
export function getFirestoreRef(query, firestore) {
  if (
    !firestore ||
    !(firestore instanceof Object) ||
    typeof firestore.collection !== 'function'
  ) {
    throw new Error(
      'Please provide a valid firestore instance to build the query'
    )
  }

  let ref = firestore
  const _query = query.replace(/"|'|\)$/g, '').split(/\(|\)/g)

  for (let i = 0; i < _query.length; i += 2) {
    const fn = _query[i].replace(/^\./g, '')
    const args = makeSpreadable(_query[i + 1])

    try {
      ref = ref[fn](...args)
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
      throw new Error(
        'Error occured while building Firestore query. Please provide a valid query.'
      )
    }
  }
  return ref
}
// getRef(`collection('events').doc('52342')`);
