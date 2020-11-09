import React, { Component } from "react";
import '../App.css'
import logo from '../../src/Skillshare_logo_2020.svg';
import { 
  BrowserRouter as Router, Route, Switch, Link, withRouter } from 'react-router-dom';

import Booking from '../pages/booking'


export class Navigation extends Component {
  nextPath(path) {
    this.props.history.push(path);
  }
  
  render() {
    return (
      <Router>
      <nav id="menu" className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            
            <div  id="menu">
              <a href="/">
                <img src={logo} alt="logo skillshare" width="230px" height="100px" />
              </a>  
            </div>
          </div>

          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link href="#features" className="page-scroll">
                  Features
                </Link>
              </li>
              <li>
                <a href="#services" className="page-scroll">
                  Technologies
                </a>
              </li>
              <li>
                <a href="#team" className="page-scroll">
                  Team
                </a>
              </li>
              <li>
                <a href="#contact" className="page-scroll">
                  contact
                </a>
              </li>
              <li>
                <div id="student"> 
                  <Link to={'/booking'} className="btn btn-custom-student btn-lg">
                  Students
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      </Router>
    );
  }
}

export default Navigation;
