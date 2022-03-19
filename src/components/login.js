import React, { Component } from "react";
import { signInWithGoogle } from "../services/firebase";

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
      const result = await signInWithGoogle();
      if (result && result.user) {
        console.log(result.user.displayName);
        this.props.history.replace("/");
      }
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