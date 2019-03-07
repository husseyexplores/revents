import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { firebaseConfig } from '../../secret'

firebase.initializeApp(firebaseConfig)
firebase.firestore()
firebase.auth()

export default firebase
