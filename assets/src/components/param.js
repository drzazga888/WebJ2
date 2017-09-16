import React from 'react'

const Param = ({ label, children }) => (
    <div className="param">
        <div className="param-label">{label}</div>
        <div className="param-content">{children}</div>
    </div>
)

export default Param