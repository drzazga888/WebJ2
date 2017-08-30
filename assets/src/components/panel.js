import React from 'react'

const Panel = ({ title, children }) => (
    <section className="panel">
        <header className="panel-header">
            <h2 className="panel-title">{title}</h2>
        </header>
        <div className="panel-content">
            {children}
        </div>
    </section>
)

export default Panel