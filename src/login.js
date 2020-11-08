import React, { Component } from "react";
import { signInWithGoogle } from "./firebase";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
    };
    this.googleSignIn = this.googleSignIn.bind(this);
  }

  async googleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <div>
        <form
          autoComplete="off"
        >
          <h1>
            Iniciar sesión
          </h1>
          <button type="button" onClick={this.googleSignIn}>
            Iniciar sesión con Google
          </button>
        </form>

      </div>
    );
  }
}