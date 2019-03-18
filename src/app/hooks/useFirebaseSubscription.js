import { useState, useEffect } from 'react'
import { normalizeFirestoreData } from '../common/util/helpers'
import firebase from '../config/firebase'

const firebaseDB = firebase.database()

/**
 *
 * @param {string} dbCollectionPath - Path to firebase db collection
 * @returns {Array.<Object>} Returns an array of objects
 */
function useFirebaseSubscription(dbCollectionPath) {
  const [fetchedData, setFetchedData] = useState([])
  const [isSubscribed, setSubscribed] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ref = firebaseDB.ref(dbCollectionPath)
    window.chatRef = ref
    ref.on('value', snapshot => {
      window.firebaseSnap = snapshot
      if (snapshot.exists()) {
        const normalized = normalizeFirestoreData()(snapshot.val())
        setFetchedData(normalized)
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
        await ref.off()
      })()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return [fetchedData, isSubscribed, error]
}

export default useFirebaseSubscription
