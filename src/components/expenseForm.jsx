import React, { Component } from "react";
import Form from "./common/form";

class ExpenseForm extends Form {
  render() {
    const { data, users, groups, onChange, onGroupChange } = this.props;

    const categories = this.props.categories
      .filter((category) => category.group === data.group);

    return (
      <Form
        legend="gasto"
        data={this.props.data}
        onSubmit={this.props.onSubmit}
        onCancel={this.props.onCancel}
      >
        {this.renderInput("Fecha", "date", "date", data.date, true)}
        {this.renderRadioGroup("Responsable", "user", data.user, true, users)}
        {this.renderInput("Valor", "number", "value", data.value, true, {
          step: "1",
        })}
        {this.renderSelect(
          "Agrupador",
          "group",
          data.group,
          true,
          groups,
          onGroupChange
        )}
        {this.renderSelect(
          "Categoría",
          "category",
          data.category,
          true,
          categories,
          onChange
        )}
        {this.renderTextarea("Observaciones", "comment", data.comment, false, {
          rows: "3",
        })}
      </Form>
    );
  }
}

export default ExpenseForm;
