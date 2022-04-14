import React, { Component } from "react";
import Input from "./input";
import RadioGroup from "./radioGroup";
import Textarea from "./textarea";
import Select from "./select";

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

  renderSelect(label, name, value, required, options, onChange) {
    return (
      <Select
        label={label}
        name={name}
        value={value}
        required={required}
        options={options}
        onChange={onChange}
      />
    );
  }

  render() {
    const {
      legend,
      data,
      onSubmit,
    } = this.props;

    return (
      <div className="row justify-content-center">
        <form onSubmit={onSubmit} className="col-sm-8 col-md-6 col-lg-4">
          <fieldset>
            <legend>{(data.id ? "Modificar " : "Crear ") + legend}</legend>
            {this.props.children}
            {this.renderButtonGroup()}
          </fieldset>
        </form>
      </div>
    );
  }
}

export default Form;
