import React from "react";

const Select = ({ name, label, options, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select {...rest} id={name} name={name} className="form-control">
        <option value=""></option>
        {options.map((option) => {
          return (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
