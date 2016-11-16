import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import {Provider} from 'react-redux'

import {AppContainer} from './components/App'
import {workersReducer, chart, workersById} from './reducers'
import {receivedWorkerState} from './actions'

//t observable = Rx.Observable.zip(
  Object.keys(workersById).forEach(id => {
    //turn Rx.Observable.create(obs => {
        workersById[id].onmessage = e => {
        	store.dispatch(receivedWorkerState({
	        	id,
	        	speed: e.data,
                      turnedOn: !!e.data
        	}))
        }
    });
        //turn Rx.Disposable.create(function() {worker.terminate();})
    //.share() 
  //, ...args => Array.from(args)
//)
//t observer = Rx.Observer.create(data => workersById[data.id].postMessage(data.remote))

//let messages = Rx.Subject.create(observer, observable)

const remoteMiddleware = msgObservers => store => next => action => {
  if (action.remote) {
    console.log('sending to worker:', action.remote)
    debugger;
    workersById[action.id].postMessage(action.remote)
    //msgObservers.onNext(action)
  }
  return next(action)
}

const createStoreWithMiddleware = applyMiddleware(
  remoteMiddleware()
)(createStore)

const reducers = combineReducers({chart, workersReducer})
const store = createStoreWithMiddleware(reducers)

//log all worker messages to console
//messages.subscribe(m => console.log('message received:', m));

//handle state messages
//messages.subscribe(
//      state => store.dispatch(
//	  receivedWorkerState(state))
//);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer>
    </AppContainer>
  </Provider>,
  document.getElementById('app-container')
)