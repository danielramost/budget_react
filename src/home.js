import { Component } from 'react';
import { Link } from "react-router-dom";
import { db } from './firebase';


class Home extends Component {

  constructor() {
    super();
    this.state = {
      expenses: [],
      loading: false,
    };
  }

  async componentDidMount() {
    this.setState({loading: true});
    db.collection('expenses').get().then((dataSnapshot) => {
      const expenses = [];
      dataSnapshot.forEach((expense) => {
        expenses.push({
          id: expense.id,
          ...expense.data(),
        });
      });
      this.setState({
        expenses: expenses,
        loading: false,
      });
    });
  }

  render() {
    const expenses = this.state.expenses;

    var expensesFields = ["date","user","group","category","value","comment"];
    const expensesHeader = expensesFields.map((field) => {
      return(
        <th key={ field } scope="col">{ field }</th>
      );
    });

    const expensesRows = expenses.map((expense) => {
      const expenseData = expensesFields.map((field) => {
        const value = expense[field];
        return(
          <td key={expense.id+"_"+field}>{value}</td>
        );
      });
      
      return(
        <tr key={expense.id}>
          {expenseData}
          <td key={expense.id+"_editar"}><a href="" className="badge badge-secondary">Editar</a></td>
        </tr>
      );
    });

    return (
      <div className="container">
        <h2>Gastos recientes</h2>
        <br/>
        <nav className="nav nav-pills">
          <Link to="/new" className="nav-link active">Nuevo gasto</Link>
          <Link to="/download" className="nav-link">Descargar</Link>
          <Link to="/delete_all" className="nav-link">Eliminar todo</Link>
        </nav>
        <br/>
        <br/>
        {this.state.loading ? <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div> : ""}
        <div className="table-responsive">
          <table className="table table-sm table-hover">
            <thead>
              <tr>
                { expensesHeader }
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              { expensesRows }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

/*class Home extends Component {

  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    db.collection('users').get().then((dataSnapshot) => {
      const users = [];
      dataSnapshot.forEach((user) => {
        users.push({
          id: user.id,
          name: user.data().name,
        });
      });
      this.setState({
        users: users,
      });
    });
  }

  render() {
    const users = this.state.users;
    const usersUI = users.map((user) => {
      return(
        <li key={user.id}>{user.name}</li>
      );
    });
    return (
      <div className="App">
        <h1>Lista de usuarios</h1>
        <ol>{usersUI}</ol>
      </div>
    );
  }
}*/

export default Home;