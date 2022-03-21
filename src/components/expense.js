import { Component } from "react";
import { withRouter } from "react-router-dom";
import Form from "./common/form";
import {
  db,
  createRecord,
  updateRecord,
  EXPENSES_COLLECTION,
} from "../services/firebase";
import { getCurrentDate } from "../utils/utils";

class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      groups: [],
      categories: [],
      data: {
        id: props.match.params.id ? props.match.params.id : "",
        date: getCurrentDate(),
        user: "",
        value: "",
        group: "",
        category: "",
        comment: "",
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleSumbit = this.handleSumbit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async componentDidMount() {
    db.collection("users")
      .orderBy("name")
      .get()
      .then((dataSnapshot) => {
        const users = [];
        dataSnapshot.forEach((user) => {
          users.push(user.data().name);
        });
        this.setState({
          users: users,
        });
      });
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
    db.collection("categories")
      .orderBy("group")
      .orderBy("category")
      .get()
      .then((dataSnapshot) => {
        const categories = [];
        dataSnapshot.forEach((category) => {
          const item = {
            id: category.id,
            ...category.data(),
          };
          item.name = item.category;
          categories.push(item);
        });
        this.setState({
          categories: categories,
        });
      });
    if (this.state.data.id) {
      db.collection(EXPENSES_COLLECTION)
        .doc(this.state.data.id)
        .get()
        .then((dataSnapshot) => {
          if (dataSnapshot.exists) {
            const expenseData = dataSnapshot.data();
            expenseData.id = this.state.data.id;
            this.setState({
              data: expenseData,
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

  handleGroupChange(event) {
    const data = { ...this.state.data };
    data.category = "";
    this.setState({
      data,
    });
    this.handleChange(event);
  }

  async handleSumbit(event) {
    event.preventDefault();
    const recordData = {
      date: this.state.data.date,
      user: this.state.data.user,
      value: parseInt(this.state.data.value),
      group: this.state.data.group,
      category: this.state.data.category,
      comment: this.state.data.comment,
    };
    if (this.state.data.id) {
      await updateRecord(EXPENSES_COLLECTION, this.state.data.id, recordData);
    } else {
      await createRecord(EXPENSES_COLLECTION, recordData);
    }
    this.props.history.push("/");
  }

  handleCancel() {
    this.props.history.push("/");
  }

  handleClearCategory() {
    document.querySelector("#category").value = "";
  }

  render() {
    const categories = this.state.categories
      .filter((category) => category.group === this.state.data.group);
    
    return (
      <div className="container">
        {
          this.state.users.length === 0 &&
          this.state.groups.length === 0 ? (
            <div className="spinner-border text-success" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <Form
              legend="gasto"
              data={this.state.data}
              onChange={this.handleChange}
              onSubmit={this.handleSumbit}
              onCancel={this.handleCancel}
              users={this.state.users}
              groups={this.state.groups}
              categories={categories}
              onGroupChange={this.handleGroupChange}
            />
          )
        }
      </div>
    );
  }
}

export default withRouter(Expense);
