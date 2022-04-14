import React, { Component } from 'react';
import Form from './common/form';

class CategoryForm extends Form {
  render() {
    const {
      data,
      onTypeChange,
    } = this.props;

    const groups = this.props.groups
      .filter((group) => group.type === data.type);

    return (
      <Form
        legend="categoría"
        data={this.props.data}
        onSubmit={this.props.onSubmit}
        onCancel={this.props.onCancel}
      >
        {this.renderRadioGroup(
          "Tipo",
          "type",
          data.type,
          true,
          [ "Egreso", "Ingreso" ]
        )}
        {this.renderSelect(
          "Agrupador",
          "group",
          data.group,
          true,
          groups,
          onTypeChange
        )}
        {this.renderInput("Nombre", "text", "category", data.category, true)}
      </Form>
    );
  }
}
 
export default CategoryForm;