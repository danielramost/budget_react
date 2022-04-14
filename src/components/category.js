import { Component } from "react";
import { withRouter } from "react-router-dom";
import CategoryForm from "./categoryForm";
import {
  db,
  createRecord,
  updateRecord,
  CATEGORIES_COLLECTION,
} from "../services/firebase";

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      data: {
        id: props.match.params.id ? props.match.params.id : "",
        category: "",
        group: "",
        type: "",
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async componentDidMount() {
    db.collection("category_groups")
      .orderBy("group")
      .get()
      .then((dataSnapshot) => {
        const groups = [];
        dataSnapshot.forEach((group) => {
          const item = {
            id: group.id,
            ...group.data(),
          };
          item.name = item.group;
          groups.push(item);
        });
        this.setState({
          groups: groups,
        });
      });
    if (this.state.data.id) {
      db.collection(CATEGORIES_COLLECTION)
        .doc(this.state.data.id)
        .get()
        .then((dataSnapshot) => {
          if (dataSnapshot.exists) {
            const categoryData = dataSnapshot.data();
            categoryData.id = this.state.data.id;
            this.setState({
              data: categoryData,
            });
          }
        });
    }
  }

  handleChange(event) {
    const data = { ...this.state.data };
    data[event.target.name] = event.target.value;
    this.setState({
      data,
    });
  }

  handleTypeChange(event) {
    const data = { ...this.state.data };
    data.group = "";
    this.setState({
      data,
    });
    this.handleChange(event);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const recordData = {
      category: this.state.data.category,
      group: this.state.data.group,
      type: this.state.data.type,
    };
    if (this.state.data.id) {
      await updateRecord(CATEGORIES_COLLECTION, this.state.data.id, recordData);
    } else {
      await createRecord(CATEGORIES_COLLECTION, recordData);
    }
    this.props.history.push("/categories");
  }

  handleCancel() {
    this.props.history.push("/categories");
  }

  render() {
    return (
      <div className="container">
        {this.state.groups.length === 0 ? (
          <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <CategoryForm
            data={this.state.data}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            onCancel={this.handleCancel}
            groups={this.state.groups}
            onTypeChange={this.handleTypeChange}
          />
        )}
      </div>
    );
  }
}

export default withRouter(Category);
