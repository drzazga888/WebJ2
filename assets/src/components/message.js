import React from 'react'

const Message = ({ type, children }) => (
    <div className={`message message-${type}`}>
        {children}
    </div>
)

export default Message