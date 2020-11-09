import React from 'react';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { Auth, Hub } from 'aws-amplify';
import { HashRouter, Route, Link, Switch } from 'react-router-dom';
import './App.css';
import Zoom from './components/zoom/zoom'
import Config from './components/dashboard/Config'
import Agenda from './components/dashboard/Agenda'
import Stats from './components/dashboard/Stats'
import Notifications from './components/dashboard/Notifications'
import Score from './Score';

import Chat from './Chat';
import Rooms from './Rooms';
import Logo from './components/dashboard/Logo';
import Student from './components/dashboard/Student';
import ListMetrics from './ListMetrics';
import ListScores from './ListScores';



function App2() {
  return (
    <div> 
        <div className="grid">
            <main>
                <div className="class-container">
                    <div className="dashboard-container">
                        <Router/>
                    </div>
                    <div className="video-container">
                      <Zoom/>
                    </div>
                </div>
            </main>
        </div>
    </div>
  );
}

function Router() {
  return (
    <div>
      <HashRouter>
        <div style={topLevelContainerStyle}>
          <div style={headerStyle}>
            <div align="center"><Logo /></div>
            <a href="/" style={homeLinkStyle}>
              <p style={titleStyle}>Live Sessions Dashboard</p>
            </a>
          </div>
          <Student/>
          <nav style={navStyle}>
            <Link to="/Notifications" style={linkStyle}>
              Home
            </Link>
            <Link to="/" style={linkStyle}>
              Chat
            </Link>
            <Link to="/Timeline" style={linkStyle}>
              Topics
            </Link>
            <Link to="/Metrics" style={linkStyle}>
              Metrics
            </Link>
            <Link to="/Scores" style={linkStyle}>
              Scores
            </Link>
            <Link to="/Config" style={linkStyle}>
              Sign Out
            </Link>                             
          </nav>
        </div>
        <div style={mainViewContainerStyle}>
          <Switch>
            <Route exact path="/">
              <Rooms />
            </Route>
            <Route path="/chat/:name/:id">
              <Chat />
            </Route>
            <Route path="/Notifications">
              <Notifications />
            </Route>
            <Route path="/Stats/:name/:id">
              <Stats />
            </Route>
            <Route path="/score/:name/:id">
              <Score />
            </Route>
            <Route path="/Timeline">
              <Agenda />
            </Route>
            <Route path="/Metrics">
              <ListMetrics />
            </Route>
            <Route path="/Scores">
              <ListScores />
            </Route>
            <Route path="/Config">
              <Config />
            </Route>                   
          </Switch>
        </div>
      </HashRouter>
    </div>
  )
}

function App() {
  console.log("b")
  const [user, updateUser] = React.useState(null);
  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(() => console.log('No signed in user.'));
      Hub.listen('auth', data => {
      switch (data.payload.event) {
        case 'signIn':
          return updateUser(data.payload.data);
        case 'signOut':
          return updateUser(null);
      }
    });
  }, []);
  if (user) {
    return <App2 />
  }
  return (
    <div>
      <div style={headerStyleAuth}>
        <span style={logoZone}><Logo /></span>
        <a href="/" style={homeLinkStyleAuth}>
          <p style={titleStyleAuth}>Live Sessions Dashboard</p>
        </a>
      </div>
      <div>
        <p>boton</p>
      </div>
      <div style={authenticationZone}>
        <AmplifyAuthenticator>
          <AmplifySignUp slot="sign-up"
            formFields={[
              { type: "username" },
              { type: "password" },
              { type: "email" }
            ]}
          />
        </AmplifyAuthenticator>
      </div>
    </div>
    
  )
}

const topLevelContainerStyle = {
  /*height: 170,*/
  position: 'sticky',
  top: 0,
  left: 0,
  /*width: '32.1%',*/
  display: 'block',
  zIndex: 200,
}

const mainViewContainerStyle = {
  padding: '20px',
}

const headerStyle = {
  backgroundColor: '#002333',
  padding: 20,
  /*color: 'white',*/
  /*width: '25%'*/
}

const titleStyle = {
  fontSize: '1.2vw',
  color: '#ffffff',
  marginTop: 10,
  fontWeight: 600,
  textAlign: 'center',
  }

const navStyle = {
  padding: '10px 15px',
  backgroundColor: '#ddd',
  /*width: '26%'*/
  fontSize: "1vw",
  textAlign: "center",
}

const homeLinkStyle = {
  textDecoration: 'none',
}

const linkStyle = {
  margin: 0,
  color: '#002333',
  textDecoration: 'none',
  fontSize: 'auto',
  marginRight: 20
}

const headerStyleAuth = {
  backgroundColor: '#002333',
  padding: 0,
  display: 'flex',
  position: 'sticky',
  height: '100px',
}

const homeLinkStyleAuth = {
  textDecoration: 'none',
  color: '#ffffff',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  left: '15%'
}

const titleStyleAuth = {
  fontSize: '2vw',
  fontWeight: 600,
}

const authenticationZone = {
  height: '100vh',
  overflow: 'scroll',
  
}

const logoZone = {
  textAlign: 'center',
  padding: '1%',
}

export default App
