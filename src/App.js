import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Calendar from './components/Calendar'

import './App.css'

function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route exact path='/' component={Calendar}></Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
