import React from 'react'

import Param from './param'

const PreviewItem = ({ className, name, ...params }) => {
    const finalClassName = `preview-item${className ? ` ${className}` : ''}`
    return (
        <div className={finalClassName}>
            <h4 className="preview-item-title">{name} <i className="change-name-button icon-pencil" title="Zmień nazwę"></i></h4>
            <div className="preview-item-tiles">
                {Object.entries(params).map(([ label, children ]) => <Param key={label} label={label}>{children}</Param>)}
            </div>
        </div>
    )
}

export default PreviewItem