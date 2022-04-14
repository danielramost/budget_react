import { Component } from "react";
import { Link } from "react-router-dom";
import {
  db,
  EXPENSES_COLLECTION,
  deleteRecord,
  deleteAllExpenses,
} from "../services/firebase";
//import ExcelExporter from "../utils/excel-exporter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

class Expenses extends Component {
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
      .orderBy("date", "desc")
      .orderBy("timestamp", "desc")
      .get()
      .then((dataSnapshot) => {
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
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
    this.setState({ loading: true });
    await this.getExpenses();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  async handleDeleteRecord(id) {
    var confirmDeletion = window.confirm("¿Eliminar el gasto seleccionado?");
    if (confirmDeletion) {
      this.setState({ loading: true });
      await deleteRecord(EXPENSES_COLLECTION, id);
      await this.getExpenses();
    }
  }

  async handleDeleteAll() {
    var confirmDeletion = window.confirm("¿Eliminar todos los gastos?");
    if (confirmDeletion) {
      this.setState({ loading: true });
      await deleteAllExpenses();
      await this.getExpenses();
    }
  }

  render() {
    const expenses = this.state.expenses;

    const expensesFields = [
      { field: "date", label: "Fecha" },
      { field: "user", label: "Responsable" },
      { field: "value", label: "Valor" },
      { field: "group", label: "Agrupador" },
      { field: "category", label: "Categoría" },
      { field: "comment", label: "Observaciones" },
    ];
    const expensesHeader = expensesFields.map((field) => {
      return (
        <th key={field.field} scope="col">
          {field.label}
        </th>
      );
    });

    const expensesRows = expenses.map((expense) => {
      const expenseData = expensesFields.map((field) => {
        const value = expense[field.field];
        return <td key={expense.id + "_" + field.field}>{value}</td>;
      });

      return (
        <tr key={expense.id}>
          {expenseData}
          <td key={expense.id + "_edit"}>
            <Link to={"expenses/" + expense.id}>
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="clickable"
                style={{ color: "black" }}
              />
            </Link>
          </td>
          <td key={expense.id + "_delete"}>
            <FontAwesomeIcon
              icon={faTrash}
              className="clickable"
              onClick={() => this.handleDeleteRecord(expense.id)}
            />
          </td>
        </tr>
      );
    });

    const expensesCompactRows = expenses.map((expense) => {
      return (
        <div
          className="row mb-2 p-2 border align-items-center"
          key={expense.id}
        >
          <div className="col">
            <div className="row">
              <div className="col-4">
                <strong>Fecha:</strong>
              </div>
              <div className="col">
                <span>{expense.date}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <strong>Agrupador:</strong>
              </div>
              <div className="col">
                <span>{expense.group}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <strong>Categoría:</strong>
              </div>
              <div className="col">
                <span>{expense.category}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <strong>Valor:</strong>
              </div>
              <div className="col">
                <span>{"$" + expense.value}</span>
              </div>
            </div>
          </div>
          <div className="col-2">
            <div className="vstack gap-4">
              <Link to={"expenses/" + expense.id} className="text-center">
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="clickable fa-xl"
                  style={{ color: "black" }}
                />
              </Link>
              <FontAwesomeIcon
                icon={faTrash}
                className="clickable fa-xl"
                onClick={() => this.handleDeleteRecord(expense.id)}
              />
            </div>
          </div>
        </div>
      );
    });

    const expensesForDownload = expenses.slice().sort((a, b) => {
      if (a["date"] < b["date"]) {
        return -1;
      } else if (a["date"] > b["date"]) {
        return 1;
      } else {
        return 0;
      }
    });

    return (
      <div className="container">
        <Link to="/expenses/new" className="btn btn-primary">
          Nuevo gasto
        </Link>
        <button className="btn btn-secondary mx-4" onClick={this.handleDeleteAll}>
          Eliminar todo
        </button>
        <br />
        <br />
        {this.state.loading ? (
          <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : this.state.width < 600 ? (
          <div className="container">{expensesCompactRows}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  {expensesHeader}
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>{expensesRows}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default Expenses;
