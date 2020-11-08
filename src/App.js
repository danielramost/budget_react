import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { auth } from './firebase';
import Login from './login';
import Home from './home';
import Expense from './expense';


function PrivateRoute({ component: Component, authenticated, ...rest }) {
  /*if (Component === Home) {
    
  } else {
    console.log("no lo es");
  }
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} users={[]} groups={[]} categories={[]} />
        ) : (
            <Redirect to="/" />
          )
      }
    />
  );*/
  if (authenticated === true) {
    return (
      <Route
        {...rest}
        render={props => <Component {...props} />}
      />
    );
  } else {
    return(<Redirect to="/" />);
  }
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === false ? (
          <Component {...props} />
        ) : (
            <Redirect to="/home" />
          )
      }
    />
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true
    };
  }

  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false
        });
      }
    });
  }

  render() {
    return this.state.loading === true ? (
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
        <Router>
          <Switch>
            <PublicRoute
              exact path="/"
              authenticated={this.state.authenticated}
              component={Login}
            />
            <PrivateRoute
              path="/home"
              authenticated={this.state.authenticated}
              component={Home}
            />
            <PrivateRoute
              path="/new"
              authenticated={this.state.authenticated}
              component={Expense}
            />
          </Switch>
        </Router>
      );
  }
}

export default App;

/*
export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        // A <Switch> looks through its children <Route>s and
        // renders the first one that matches the current URL.
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}



function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
*/