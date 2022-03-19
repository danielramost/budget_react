import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { auth } from "./firebase";
import Login from "./login";
import Home from "./home";
import Expense from "./expense";
import Categories from "./categories";
import Category from "./category";
import NavBar from "./components/navBar";
import PrivateRoute from "./components/privateRoute";
import Logout from "./components/logout";

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === false ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true,
    };
    this.authStateListener = null;
  }

  componentDidMount() {
    this.authStateListener = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false,
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    });
  }

  componentWillUnmount() {
    this.authStateListener && this.authStateListener();
  }

  render() {
    return this.state.loading === true ? (
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
      <React.Fragment>
        <Router>
          <NavBar />
          <main>
            <Switch>
              {!this.state.authenticated && (
                <PublicRoute
                  path="/login"
                  authenticated={this.state.authenticated}
                  component={Login}
                />
              )}
              <PrivateRoute
                path="/logout"
                authenticated={this.state.authenticated}
                component={Logout}
              />
              <PrivateRoute
                path="/expenses"
                authenticated={this.state.authenticated}
                component={Home}
              />
              <PrivateRoute
                path="/expenses/new"
                authenticated={this.state.authenticated}
                component={Expense}
              />
              <PrivateRoute
                path="/expenses/:id"
                authenticated={this.state.authenticated}
                component={Expense}
              />
              <PrivateRoute
                exact
                path="/categories"
                authenticated={this.state.authenticated}
                component={Categories}
              />
              <PrivateRoute
                path="/categories/new"
                authenticated={this.state.authenticated}
                component={Category}
              />
              <PrivateRoute
                path="/categories/:id"
                authenticated={this.state.authenticated}
                component={Category}
              />
              <Redirect from="/" to="/expenses" />
            </Switch>
          </main>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
