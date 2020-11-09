import React, { Component } from 'react'
import Navigation from './components/navigation';
import Header from './components/header';
import Features from './components/features';
import About from './components/about';
import Services from './components/services';
import Team from './components/Team';
import Contact from './components/contact'
import JsonData from './data/data.json';
import { 
  BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Booking from './pages/booking'

export class App extends Component {
  state = {
    landingPageData: {},
  }
  getlandingPageData() {
    this.setState({landingPageData: JsonData})
  }

  componentDidMount() {
    this.getlandingPageData();
  }

  render() {
    return (
    <Router>
        <Switch>
          <Route exact path="/booking" component={Booking}>
            <Booking/>
          </Route>
          <Route path="/">
            <div>
            <Navigation />
            <Header data={this.state.landingPageData.Header} />
            <Features data={this.state.landingPageData.Features} />
            <About data={this.state.landingPageData.About} />
            <Services data={this.state.landingPageData.Services} />
            <Team data={this.state.landingPageData.Team} />
            <Contact  data={this.state.landingPageData.Contact}/>
            </div>
          </Route>
      </Switch>
    </Router>
    )
  }
}

export default App;
