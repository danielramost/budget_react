import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class NavBar extends Component {
  state = {
    showExtraMenu: false
  };

  constructor() {
    super();
    this.toggleExtraMenu = this.toggleExtraMenu.bind(this);
  }

  toggleExtraMenu(e) {
    e.preventDefault();
    this.setState({ showExtraMenu: !this.state.showExtraMenu });
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
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
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
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  onClick={this.toggleExtraMenu}
                >
                  Más
                </a>
                <ul className={`dropdown-menu ${this.state.showExtraMenu ? "show" : ""}`}>
                  <li>
                    <a className="dropdown-item" href="#">
                      Descargar
                    </a>
                    {/* <ExcelExporter data={expensesForDownload} fields={expensesFields} /> */}
                  </li>
                  <li><hr className="dropdown-divider"/></li>
                  <li>
                    <NavLink className="dropdown-item" to="/logout">
                      Cerrar sesión
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
