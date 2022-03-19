import React from "react";

const RadioGroup = ({ name, label, value, required, onChange, options }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {options.map((option) => {
        const optionKey = `${name}_${option}`;
        return (
          <div key={`div_${optionKey}`} className="form-check">
            <label>
              <input
                key={optionKey}
                type="radio"
                id={optionKey}
                name={name}
                value={option}
                required={required}
                checked={value === option}
                onChange={onChange}
                className="form-check-input"
              />
              {option}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default RadioGroup;
