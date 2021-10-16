import { Component } from 'react';
import { Link } from "react-router-dom";
import { db, EXPENSES_COLLECTION, deleteRecord, deleteAllExpenses } from './firebase';
import ExcelExporter from './excel-exporter';


class Home extends Component {

  constructor() {
    super();
    this.state = {
      expenses: [],
      loading: false,
      width: 0,
      height: 0,
    };
    this.handleDeleteRecord = this.handleDeleteRecord.bind(this);
    this.handleDeleteAll = this.handleDeleteAll.bind(this);
  }

  async getExpenses() {
    db.collection(EXPENSES_COLLECTION)
      .orderBy('date', 'desc').orderBy('timestamp', 'desc')
      .get().then((dataSnapshot) =>
    {
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

  async componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
    this.setState({loading: true});
    await this.getExpenses();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  async handleDeleteRecord(id, event) {
    event.preventDefault();
    var confirmDeletion = window.confirm("¿Eliminar el gasto seleccionado?");
    if (confirmDeletion) {
      this.setState({loading: true});
      await deleteRecord(EXPENSES_COLLECTION, id);
      await this.getExpenses();
    }
  }

  async handleDeleteAll(event) {
    event.preventDefault();
    var confirmDeletion = window.confirm("¿Eliminar todos los gastos?");
    if (confirmDeletion) {
      this.setState({loading: true});
      await deleteAllExpenses();
      await this.getExpenses();
    }
  }

  render() {
    const expenses = this.state.expenses;

    const expensesFields = [
      {field: "date", label: "Fecha"},
      {field: "user", label: "Responsable"},
      {field: "value", label: "Valor"},
      {field: "group", label: "Agrupador"},
      {field: "category", label: "Categoría"},
      {field: "comment", label: "Observaciones"},
    ];
    const expensesHeader = expensesFields.map((field) => {
      return(
        <th key={ field.field } scope="col">{ field.label }</th>
      );
    });

    const expensesRows = expenses.map((expense) => {
      const expenseData = expensesFields.map((field) => {
        const value = expense[field.field];
        return(
          <td key={expense.id+"_"+field.field}>{value}</td>
        );
      });
      
      return(
        <tr key={expense.id}>
          {expenseData}
          <td key={expense.id + "_editar"}><Link to={"expenses/" + expense.id} className="badge badge-secondary">Editar</Link></td>
          <td key={expense.id + "_eliminar"}><a href={ expense.id } onClick={ (e) => this.handleDeleteRecord(expense.id, e) } className="badge badge-secondary">Eliminar</a></td>
        </tr>
      );
    });

    const expensesCompactRows = expenses.map((expense) => {
      return(
        <div className="row mb-2 p-2 border" key={expense.id}>
          <div className="col">
            <h6 className="fw-bold">{expense.date}</h6>
            <h6><span className="fst-italic">Agrupador: </span>{expense.group}</h6>
            <h6><span className="fst-italic">Categoría: </span>{expense.category}</h6>
            <p><span className="fst-italic">Valor: </span>{"$" + expense.value}</p>
          </div>
          <div className="col-4 align-self-center">
            <div className="row mb-4">
              <Link to={"expenses/" + expense.id} className="btn btn-secondary">Editar</Link>
            </div>
            <div className="row">
              <a href={expense.id} onClick={(e) => this.handleDeleteRecord(expense.id, e)} className="btn btn-secondary">Eliminar</a>
            </div>
          </div>
        </div>
      );
    });

    const expensesForDownload = expenses.slice().sort((a, b) => {
      if (a['date'] < b['date']) {
        return -1;
      } else if (a['date'] > b['date']) {
        return 1;
      } else {
        return 0;
      }
    });

    return (
      <div className="container">
        <h2>Gastos recientes</h2>
        <br/>
        <nav className="nav nav-pills">
          <Link to="/expenses/new" className="nav-link active">Nuevo gasto</Link>
          <ExcelExporter data={ expensesForDownload } fields={ expensesFields } />
          <button onClick={ this.handleDeleteAll } className="btn btn-link">Eliminar todo</button>
          <Link to="/categories" className="btn btn-link">Categorías</Link>
        </nav>
        <br/>
        <br/>
        {this.state.loading ? <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div> :
          this.state.width < 600 ?
            <div className="container">
              { expensesCompactRows }
            </div>
            :
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
        }
      </div>
    );
  }
}

export default Home;