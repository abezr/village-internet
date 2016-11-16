export function receivedWorkerState(state){
    return {
        type: 'RECEIVED_WORKER_STATE',
        state
    }
}

export function setCoreSpeed(id, speed){
    return {
        type: 'SET_CORE_SPEED',
        id,
        speed,
        remote: speed
    }
}

export function turnOn(id){
    return {
        type: 'TURN_CORE_ON',
        id,
        remote: `start`
    }
}

export function turnOff(id){
    return {
        type: 'TURN_CORE_OFF',
        id,
        remote: `stop`
    }
}

export function coreSelected(id){
    return {
        type: 'CORE_SELECTED',
        id
    }
}