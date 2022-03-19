import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { db, createRecord, updateRecord, EXPENSES_COLLECTION } from '../services/firebase';
import { getCurrentDate } from '../utils/utils';


class Expense extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      groups: [],
      categories: [],
      id: props.match.params.id ? props.match.params.id : "",
      date: getCurrentDate(),
      user: "",
      value: "",
      group: "",
      category: "",
      comment: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleSumbit = this.handleSumbit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async componentDidMount() {
    db.collection('users')
      .orderBy('name').get().then((dataSnapshot) => {
        const users = [];
        dataSnapshot.forEach((user) => {
          users.push(user.data().name);
        });
        this.setState({
          users: users,
        });
      });
    db.collection('categories')
      .orderBy('group').orderBy('category').get().then((dataSnapshot) => {
        const groups = {};
        const categories = [];
        dataSnapshot.forEach((category) => {
          groups[category.data().group] = true;
          categories.push({
            id: category.id,
            ...category.data(),
          });
        });
        this.setState({
          groups: Object.keys(groups).sort(),
          categories: categories,
        });
      });
    if (this.state.id) {
      db.collection(EXPENSES_COLLECTION).doc(this.state.id)
        .get().then((dataSnapshot) => {
          if (dataSnapshot.exists) {
            const expenseData = dataSnapshot.data();
            this.setState({
              date: expenseData.date,
              user: expenseData.user,
              value: expenseData.value,
              group: expenseData.group,
              category: expenseData.category,
              comment: expenseData.comment,
            });
          }
        });
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleGroupChange(event) {
    this.setState({
      category: "",
    });
    this.handleChange(event);
  }

  async handleSumbit(event) {
    event.preventDefault();
    const recordData = {
      date: this.state.date,
      user: this.state.user,
      value: parseInt(this.state.value),
      group: this.state.group,
      category: this.state.category,
      comment: this.state.comment,
    };
    if (this.state.id) {
      await updateRecord(EXPENSES_COLLECTION, this.state.id, recordData);
    } else {
      await createRecord(EXPENSES_COLLECTION, recordData);
    }
    this.props.history.push('/');
  }

  handleCancel() {
    this.props.history.push('/');
  }

  handleClearCategory() {
    document.querySelector('#category').value = "";
  }

  render() {
    const users = this.state.users.map((user) => {
      return (
        <div key={"div_user_" + user} className="form-check">
          <label>
            <input key={"user_" + user} type="radio" id={"user_" + user} name="user" value={user} required checked={this.state.user === user} onChange={this.handleChange} className="form-check-input" />
            {user}
          </label>
        </div>
      );
    });

    const groups = this.state.groups.map((group) => {
      return (
        <option key={"group_" + group} value={group}>{group}</option>
      );
    });

    const categories = this.state.categories.filter(category => category.group === this.state.group).map((category) => {
      return (
        <option key={category.id} value={category.category}>{category.category}</option>
      );
    });

    return (
      <div className="container">
        {this.state.users.length > 0 && this.state.groups > 0 ? <div className="spinner-border text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div> :
          <div className="row justify-content-center">
            <form onSubmit={this.handleSumbit} className="col-sm-8 col-md-6 col-lg-4">
              <fieldset>
                <legend>{this.state.id ? 'Modificar gasto' : 'Nuevo gasto'}</legend>
                <div className="form-group">
                  <label>
                    Fecha
                    <input type="date" id="date" name="date" value={this.state.date} required onChange={this.handleChange} className="form-control" />
                  </label>
                </div>
                <div className="form-group">
                  Responsable
                  {users}
                </div>
                <div className="form-group">
                  <label>
                    Valor
                    <input type="number" id="value" name="value" value={this.state.value} step="1" required onChange={this.handleChange} className="form-control" />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Agrupador
                    <select id="group" name="group" value={this.state.group} onChange={this.handleGroupChange} required className="form-control">
                      <option value="">Seleccionar</option>
                      {groups}
                    </select>
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Categoría
                    <select id="category" name="category" value={this.state.category} onChange={this.handleChange} required className="form-control">
                      <option value=""></option>
                      {categories}
                    </select>
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Observaciones
                    <textarea id="comment" name="comment" value={this.state.comment} rows="3" onChange={this.handleChange} className="form-control"></textarea>
                  </label>
                </div>
                <div className="btn-group" role="group" aria-label="Form button group">
                  <input type="submit" value="Guardar" className="btn btn-primary me-5" />
                  <button onClick={this.handleCancel} className="btn btn-outline-secondary">Cancelar</button>
                </div>
              </fieldset>
            </form>
          </div>
        }
      </div>
    );
  }
}

export default withRouter(Expense);