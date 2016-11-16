import React from 'react'
import {Navbar, Nav, NavItem, Badge, ProgressBar} from 'react-bootstrap'
import Switch from 'react-bootstrap-switch'
import {LineChart, XAxis, YAxis, Line, Tooltip, CartesianGrid, ResponsiveContainer} from 'recharts'
import {connect} from 'react-redux'
import * as actions from '../actions'


const WorkerChart = ({data}) => (
    <div className="row">
        <div className="col-md-11" style={{height: '400px', paddingTop:'20px'}}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <XAxis tick={false}/>
                    <YAxis tickCount={10}/>
                    <Tooltip />
                    <CartesianGrid />
                    <Line dataKey="speed" isAnimationActive={false} unit="ops/s" />
                    <Line dataKey="limit" isAnimationActive={false} unit="ops/s" stroke="red"/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
)

const TopNav = ({projectName}) => (
    <Navbar>
        <Navbar.Header>
            <Navbar.Brand>
                <a href="#">{projectName}</a>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <NavItem eventKey={1} href="#">Home</NavItem>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
)

const SpeedBar = ({min, max, value, label}) => (
    <ProgressBar
            now={value} 
            min={min} 
            max={max}
            label={`${label} ops/s`} 
            />
)

const SpeedLimit = ({currentLimit, onSetSpeed}) => (
    <input 
        onChange={e => onSetSpeed(e.currentTarget.valueAsNumber)} 
        value={currentLimit} 
        type="range" 
        min="0" 
        max="100" 
        step="1" />
)

const WorkerInfo = ({worker, onSelectWorker}) => (
    <div className="col-md-2">
        <a href="#" onClick={onSelectWorker}>
            Core {worker.id}
        </a><br/>
        <span className="label label-info">
            {`${worker.speedSet} %`}
        </span>
    </div>
)

const Worker = ({worker, onTurnOn, onTurnOff, onSetSpeed, onSelectWorker}) => (
    <div className="row" style={{paddingBottom: '10px'}}>
        <WorkerInfo worker={worker} onSelectWorker={() => onSelectWorker(worker.id)} />
        <div className="col-md-1">
            <Switch 
                value={worker.turnedOn}
                onChange={(e, v) => worker.turnedOn ? onTurnOff(worker.id) : onTurnOn(worker.id)} 
                onColor="success" 
                offColor="danger" 
                bsSize="mini" />
        </div>
        {worker.turnedOn && <div className="col-md-9">
            <SpeedBar min={0} max={100} value={worker.speedSet} label={worker.speed} />
            <SpeedLimit 
                currentLimit={worker.speedSet} 
                onSetSpeed={s => onSetSpeed(worker.id, s)} 
                />
        </div>}
    </div>
)

const WorkersList = ({workers, onTurnOn, onTurnOff, onSetSpeed, onSelectWorker}) => (
    <div>
        {workers.map(e => 
            <Worker 
                key={e.id} 
                worker={e} 
                onTurnOn={onTurnOn} 
                onTurnOff={onTurnOff} 
                onSetSpeed={onSetSpeed} 
                onSelectWorker={onSelectWorker}
                />)}
    </div>
)

export const App = ({workers, chart, setCoreSpeed, turnOn, turnOff, coreSelected}) => (
    <div className="container">
        <TopNav projectName="Heater 2" />
        <WorkersList 
            workers={workers}
            onSetSpeed={setCoreSpeed}
            onTurnOn={turnOn}
            onTurnOff={turnOff} 
            onSelectWorker={coreSelected}/>
        {chart && chart.selected && <div>
            <h4>{chart.selected} speed:</h4>
            <WorkerChart data={chart.data}/>
        </div>}
    </div>
)

export const AppContainer = connect(
    (store) => { return {
        workers: store.workersReducer,
        chart: store.chart
    }},
    actions
)(App)