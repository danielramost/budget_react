import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { db, createRecord, updateRecord, CATEGORIES_COLLECTION } from './firebase';


class Category extends Component {

  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      id: props.match.params.id ? props.match.params.id : "",
      category: "",
      group: "",
      type: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSumbit = this.handleSumbit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async componentDidMount() {
    db.collection('category_groups')
      .orderBy('group').get().then((dataSnapshot) => {
        const groups = [];
        dataSnapshot.forEach((group) => {
          groups.push({
            id: group.id,
            ...group.data(),
          });
        });
        this.setState({
          groups: groups,
        });
      });
    if (this.state.id) {
      db.collection(CATEGORIES_COLLECTION).doc(this.state.id)
        .get().then((dataSnapshot) => {
          if (dataSnapshot.exists) {
            const categoryData = dataSnapshot.data();
            this.setState({
              category: categoryData.category,
              group: categoryData.group,
              type: categoryData.type,
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

  handleTypeChange(event) {
    this.setState({
      group: "",
    });
    this.handleChange(event);
  }

  async handleSumbit(event) {
    event.preventDefault();
    const recordData = {
      category: this.state.category,
      group: this.state.group,
      type: this.state.type,
    };
    if (this.state.id) {
      await updateRecord(CATEGORIES_COLLECTION, this.state.id, recordData);
    } else {
      await createRecord(CATEGORIES_COLLECTION, recordData);
    }
    this.props.history.push('/categories');
  }

  handleCancel() {
    this.props.history.push('/categories');
  }

  render() {
    const EXPENSE_TYPE_VALUE = "Egreso";
    const INCOME_TYPE_VALUE = "Ingreso";

    const groups = this.state.groups.filter(group => group.type === this.state.type).map((group) => {
      return (
        <option key={group.id} value={group.group}>{group.group}</option>
      );
    });

    return (
      <div className="container">
        {this.state.groups > 0 ? <div className="spinner-border text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div> :
          <div className="row justify-content-center">
            <form onSubmit={this.handleSumbit} className="col-sm-8 col-md-6 col-lg-4">
              <fieldset>
                <legend>{this.state.id ? 'Modificar categoría' : 'Nueva categoría'}</legend>
                <div className="form-group">
                  Tipo
                  <div className="form-check">
                    <label>
                      <input type="radio" id="expense_type_radio" name="type" value={EXPENSE_TYPE_VALUE} required checked={this.state.type === EXPENSE_TYPE_VALUE} onChange={this.handleTypeChange} className="form-check-input" />
                      {EXPENSE_TYPE_VALUE}
                    </label>
                  </div>
                  <div className="form-check">
                    <label>
                      <input type="radio" id="income_type_radio" name="type" value={INCOME_TYPE_VALUE} required checked={this.state.type === INCOME_TYPE_VALUE} onChange={this.handleTypeChange} className="form-check-input" />
                      {INCOME_TYPE_VALUE}
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Agrupador
                    <select id="group" name="group" value={this.state.group} onChange={this.handleChange} required className="form-control">
                      <option value="">Seleccionar</option>
                      {groups}
                    </select>
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Nombre
                    <input type="text" id="category" name="category" value={this.state.category} required onChange={this.handleChange} className="form-control" />
                  </label>
                </div>
                <div className="btn-group" role="group" aria-label="Form button group">
                  <input type="submit" value="Guardar" className="btn btn-primary mr-3" />
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

export default withRouter(Category);