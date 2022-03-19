import React, { Component } from "react";
import Input from "./input";
import RadioGroup from "./radioGroup";
import Textarea from "./textarea";

class Form extends Component {
  renderInput(label, type, name, value, required, optionalParams) {
    return (
      <Input
        {...optionalParams}
        label={label}
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={this.props.onChange}
      />
    );
  }

  renderRadioGroup(label, name, value, required, options) {
    return (
      <RadioGroup
        label={label}
        name={name}
        value={value}
        required={required}
        options={options}
        onChange={this.props.onChange}
      />
    );
  }

  renderTextarea(label, name, value, required, optionalParams) {
    return (
      <Textarea
        {...optionalParams}
        label={label}
        name={name}
        value={value}
        required={required}
        onChange={this.props.onChange}
      />
    );
  }

  renderButtonGroup() {
    return (
      <div className="btn-group mt-4" role="group">
        <input type="submit" value="Guardar" className="btn btn-primary me-5" />
        <input
          type="button"
          onClick={this.props.onCancel}
          value="Cancelar"
          className="btn btn-outline-secondary"
        />
      </div>
    );
  }

  render() {
    const {
      legend,
      data,
      onChange,
      onSubmit,
      users,
      groups,
      categories,
      onGroupChange,
    } = this.props;

    return (
      <div className="row justify-content-center">
        <form onSubmit={onSubmit} className="col-sm-8 col-md-6 col-lg-4">
          <fieldset>
            <legend>{(data.id ? "Modificar " : "Nuevo ") + legend}</legend>
            {this.renderInput("Fecha", "date", "date", data.date, true)}
            {this.renderRadioGroup(
              "Responsable",
              "user",
              data.user,
              true,
              users
            )}
            {this.renderInput("Valor", "number", "value", data.value, true, {
              step: "1",
            })}
            <div className="form-group">
              <label>
                Agrupador
                <select
                  id="group"
                  name="group"
                  value={data.group}
                  onChange={onGroupChange}
                  required
                  className="form-control"
                >
                  <option value="">Seleccionar</option>
                  {groups}
                </select>
              </label>
            </div>
            <div className="form-group">
              <label>
                Categoría
                <select
                  id="category"
                  name="category"
                  value={data.category}
                  onChange={onChange}
                  required
                  className="form-control"
                >
                  <option value=""></option>
                  {categories}
                </select>
              </label>
            </div>
            {this.renderTextarea(
              "Observaciones",
              "comment",
              data.comment,
              false,
              { rows: "3" }
            )}
            {this.renderButtonGroup()}
          </fieldset>
        </form>
      </div>
    );
  }
}

export default Form;
