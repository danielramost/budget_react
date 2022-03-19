import { Component } from 'react';
import { Link } from "react-router-dom";
import { db, CATEGORIES_COLLECTION, deleteRecord } from '../services/firebase';


class Categories extends Component {

  constructor() {
    super();
    this.state = {
      categories: [],
      loading: false,
    };
    this.handleDeleteRecord = this.handleDeleteRecord.bind(this);
  }

  async getCategories() {
    db.collection(CATEGORIES_COLLECTION)
      .orderBy('type')
      .orderBy('group')
      .orderBy('category')
      .get().then((dataSnapshot) => {
        const categories = [];
        dataSnapshot.forEach((category) => {
          categories.push({
            id: category.id,
            ...category.data(),
          });
        });
        this.setState({
          categories: categories,
          loading: false,
        });
      });
  }

  async componentDidMount() {
    this.setState({ loading: true });
    await this.getCategories();
  }

  async handleDeleteRecord(id, event) {
    event.preventDefault();
    var confirmDeletion = window.confirm("¿Eliminar el registro seleccionado?");
    if (confirmDeletion) {
      this.setState({ loading: true });
      await deleteRecord(CATEGORIES_COLLECTION, id);
      await this.getCategories();
    }
  }

  render() {
    const categories = this.state.categories;

    const categoryFields = [
      { field: "category", label: "Categoría" },
      { field: "group", label: "Agrupador" },
      { field: "type", label: "Tipo" },
    ];
    const categoriesHeader = categoryFields.map((field) => {
      return (
        <th key={field.field} scope="col">{field.label}</th>
      );
    });

    const categoriesRows = categories.map((category) => {
      const categoryData = categoryFields.map((field) => {
        const value = category[field.field];
        return (
          <td key={category.id + "_" + field.field}>{value}</td>
        );
      });

      return (
        <tr key={category.id}>
          {categoryData}
          <td key={category.id + "_edit"}><Link to={"categories/" + category.id} className="badge badge-secondary">Editar</Link></td>
          <td key={category.id + "_delete"}><a href={category.id} onClick={(e) => this.handleDeleteRecord(category.id, e)} className="badge badge-secondary">Eliminar</a></td>
        </tr>
      );
    });

    return (
      <div className="container">
        <Link to="/categories/new" className="btn btn-primary">Nueva categoría</Link>
        <br />
        <br />
        {this.state.loading ? <div className="spinner-border text-success" role="status">
          <span className="sr-only">Loading...</span>
        </div> :
          <div className="table-responsive">
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  {categoriesHeader}
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {categoriesRows}
              </tbody>
            </table>
          </div>
        }
      </div>
    );
  }
}

export default Categories;