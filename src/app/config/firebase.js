import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'

import { firebaseConfig } from '../../secret'

firebase.initializeApp(firebaseConfig)
firebase.firestore()
firebase.auth()
firebase.storage()
firebase.database()

export default firebase
