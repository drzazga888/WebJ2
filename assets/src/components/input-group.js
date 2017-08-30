import React from 'react'

const InputGroup = ({ label, validationMessage, isValid, children }) => (
    <label className={`input-group ${isValid ? '' : 'input-group-invalid'}`}>
        <span className="input-group-label">{label}</span>
        <span className="input-group-child">{children}</span>
        { isValid ? null : <span className="input-group-error">{validationMessage}</span> }
    </label>
)

export default InputGroup