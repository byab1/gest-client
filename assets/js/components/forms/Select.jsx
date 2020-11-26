import React from 'react';

const Select = ({name, value, onChange, label, error="", children}) => {
    return ( 
    <>
     <div className="form-group">
                <label htmlFor={name}>{label}</label>
                <select onChange={onChange} name={name} value={value} id={name} className={"form-control" + (error && " is-invalid")}>
                    {children}
                </select>
                <p className="invalid-feedback">{error}</p>
    </div>
    </> );
}
 
export default Select;