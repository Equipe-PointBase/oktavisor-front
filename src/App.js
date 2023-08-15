import React, {Component} from 'react'
import { Route } from 'react-router-dom'

import Nav from './Nav'
import Home from './Home'
import EnvironmentPage from './EnvironmentPage'

class App extends Component {
  render() {
    return (
      <div className="container">
        <Nav/><br/>
        <Route exact path="/" component={Home} />
        <Route path="/environment/:id" component={EnvironmentPage} />
      </div>      
    )
  }
}

export default App