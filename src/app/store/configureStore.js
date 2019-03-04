import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'

const configureStore = preloadedState => {
  const middlewares = [thunk]
  const middlewareEnahcer = applyMiddleware(...middlewares)

  const reduxDevToolsInitializer =
    typeof window === 'object' &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f

  const storeEnhancers = [middlewareEnahcer, reduxDevToolsInitializer]

  const composedEnhancers = compose(...storeEnhancers)

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
