import React from 'react'

import Param from './param'

export default class PreviewItem extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            uiName: this.props.name
        }
    }

    componentWillReceiveProps(newProps) {
        if ((newProps.name !== this.props.name) || (newProps.loaded && !this.props.loaded)) {
            this.setState({
                uiName: newProps.name
            })
        }
    }

    onNameChange = (e) => {
        this.setState({
            uiName: e.target.value
        })
    }

    onCancelNameChange = (e) => {
        this.setState({
            uiName: this.props.name
        })
    }

    onAcceptNameChange = () => {
        this.props.onNameChange(this.state.uiName)
    }

    render() {
        const { className, name, onNameChange, loaded, mapping, readOnly, ...params } = this.props
        const { uiName } = this.state
        const finalClassName = `preview-item${className ? ` ${className}` : ''}${loaded ? '' : ' indeterminate'}`
        const editMode = uiName !== name
        return (
            <div className={finalClassName}>
                <h4 className="preview-item-title">
                    <input type="text" className="preview-item-title-content" value={uiName} onChange={this.onNameChange} readOnly={readOnly} />
                    { !readOnly && editMode ? <i className="clickable change-name-confirm icon-check" title="Zatwierdź zmienę nazwy" onClick={this.onAcceptNameChange}></i> : null }
                    { !readOnly && editMode ? <i className="clickable change-name-cancel icon-cancel" title="Anuluj zmianę nazwy" onClick={this.onCancelNameChange}></i> : null }
                </h4>
                <div className="preview-item-tiles">
                    {Object.entries(params).map(([ label, children ]) => <Param key={label} label={mapping[label] || label}>{children}</Param>)}
                </div>
            </div>
        )
    }

    static defaultProps = {
        mapping: {},
        readOnly: false
    }

}