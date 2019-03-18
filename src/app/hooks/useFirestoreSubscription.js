import { useState, useEffect, useMemo } from 'react'
import { getFirestoreRef, normalizeFirestoreData } from '../common/util/helpers'
import firebase from '../config/firebase'

const firestoreDB = firebase.firestore()

/**
 *
 * @param {Object} firestoreQuery - Path to firebase db collection
 * @param {string} firestoreQuery.collection - Path to firebase db collection
 * @param {string} firestoreQuery.doc - Path to firebase db collection
 * @param {Array.<string>} firestoreQuery.where - Path to firebase db collection
 * @param {Object} options - Path to firebase db collection
 * @param {Array.<string>} [options.normalize=['date', 'createdAt', 'joinDate', 'eventDate']] - Path to firebase db collection
 * @param {boolean} [options.mergeNormalize=true] - Merge normalize your fields into the default existing one?
 * @param {boolean} [options.deepNormalize=false] - Deep normalizes the data
 * @returns {Array.<Object>} Returns an array of data
 */
function useFirestoreSubscription(
  firestoreQuery,
  { normalize = [], mergeNormalize = true, deepNormalize = false } = {}
) {
  const _fields = ['date', 'createdAt', 'joinDate', 'eventDate']
  // sanity checks for normalization fields
  if (!Array.isArray(normalize)) {
    throw new Error(
      'Expected `normalize` to be an array, but found ' + typeof normalize
    )
  }

  let _fieldsToNormalize
  if (mergeNormalize) {
    _fieldsToNormalize = [..._fields, ...normalize]
  } else {
    _fieldsToNormalize = normalize
  }

  const options = useMemo(() => {
    return {
      fields: _fieldsToNormalize,
      mergeNormalize,
      deepNormalize,
    }
  }, [_fieldsToNormalize, deepNormalize, mergeNormalize])

  const queryRef = getFirestoreRef(firestoreQuery, firestoreDB)

  // Hook logic
  const [fetchedData, setFetchedData] = useState([])
  const [isSubscribed, setSubscribed] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    let unsubscribe = () => {
      return
    }

    unsubscribe = queryRef.onSnapshot(realtimeSnapshot => {
      if (realtimeSnapshot.exists) {
        window.firestoreSnap = realtimeSnapshot
        const data = [{ id: realtimeSnapshot.id, ...realtimeSnapshot.data() }]

        const normalizedData = normalizeFirestoreData(options)(data)

        setFetchedData(normalizedData)
        setSubscribed(true)
        setError(null)
      } else {
        setFetchedData([])
        setError({
          code: 'NOT_FOUND',
          message: 'Document does not exist',
        })
        setSubscribed(true)
      }
    })

    return () => {
      ;(async () => {
        await unsubscribe()
      })()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return [fetchedData, isSubscribed, error]
}

export default useFirestoreSubscription
