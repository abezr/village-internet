import {worker} from './worker'

const workerUrl = window.URL.createObjectURL(new Blob([
  '(' + worker.toString() + ')()'
]));

const workers = [...Array(navigator.hardwareConcurrency)]
  .map(() => new Worker(workerUrl))

export const workersById = workers.reduce((acc,w,id) => {acc[id] = w; return acc}, {})
const initialState = Object.keys(workersById)
	.map(id => Object.assign({
			id,
			turnedOn: false,
			speedSet: 50,
			speed: 0,
		}))
    //{ id: "acc1", turnedOn: true, speed: 35, speedSet: 40},
    //{ id: "acc2", turnedOn: false}

const setCoreSpeedSet = (worker, speed) => {
    if(speed !== undefined) {
        worker.speedSet = speed
    }
    return worker
}

const mergeWorkerState = (workersList, worker) =>
    workersList.map(w => w.id !== worker.id ? w : Object.assign(w,worker))

export function workersReducer(state=initialState, action){
    switch (action.type) {
        case 'RECEIVED_WORKER_STATE':
            return mergeWorkerState(state, action.state);
        case 'SET_CORE_SPEED':
            return state.map(e => e.id === action.id 
                                ? setCoreSpeedSet(e, action.speed)
                                : e)
        default:
            return state
    }
}

const rememberSpeed = (history, id, newSpeed) => {
    let newHistory = history || []
    let newRecord = newSpeed
                        .filter(d => d.id === id)
                        .map(d => { 
                            return { 
                                speed: d.speed, 
                                limit: d.speedSet
                            }
                        })[0]

    newHistory.push(newRecord)

    if(newHistory.length > 20){
        newHistory = newHistory.slice(1);
    }

    if(newHistory.length < 20){
        while(newHistory.length < 20){
            newHistory.push(newRecord);
        }
    }

    return newHistory
}

export function chart(state=initialState, action){
    switch (action.type) {
        case 'RECEIVED_WORKER_STATE':
            const prevState = state.find(s => action.state.id === s.id)
            return mergeWorkerState(state, prevState.selected 
                    ? Object.assign(prevState, {data: rememberSpeed(prevState.data, prevState.selected, action.state)}) 
                    : prevState)
        case 'CORE_SELECTED':
            return Object.assign(state, {selected: action.id, data: []})
        default:
            return state
    }
}