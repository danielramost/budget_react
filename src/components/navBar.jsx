import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class NavBar extends Component {
  state = {
    isCollapsed: true
  };

  constructor() {
    super();
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  toggleCollapsed(e) {
    e.preventDefault();
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Gastos recientes</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            onClick={this.toggleCollapsed}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`${this.state.isCollapsed ? "collapse" : ""} navbar-collapse`} id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/expenses">
                  Gastos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/categories">
                  Categorías
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/logout">
                  Cerrar sesión
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
