import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
// import { getFirebase } from 'react-redux-firebase'

import firebase from '../config/firebase'

import rootReducer from '../reducers'

const configureStore = preloadedState => {
  const middlewares = [thunk.withExtraArgument({ firebase })]
  const middlewareEnahcer = applyMiddleware(...middlewares)

  // not working with redux compose and with reactReduxFirebase `attachAuthIsReady`
  // Need to debug.
  const reduxDevToolsInitializer =
    typeof window === 'object' &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f

  // const storeEnhancers = [middlewareEnahcer, reduxDevToolsInitializer]
  const storeEnhancers = [middlewareEnahcer]

  const composedEnhancers = composeWithDevTools(...storeEnhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('../reducers', () => {
        const newRootReducer = require('../reducers/').default
        store.replaceReducer(newRootReducer)
      })
    }
  }
  return store
}

export default configureStore
