import React from "react";

const Textarea = ({ name, label, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <textarea {...rest} id={name} name={name} className="form-control" />
    </div>
  );
};

export default Textarea;
