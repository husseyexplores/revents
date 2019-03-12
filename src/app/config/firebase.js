import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

import { firebaseConfig } from '../../secret'

firebase.initializeApp(firebaseConfig)
firebase.firestore()
firebase.auth()
firebase.storage()

export default firebase
