import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'

import PreviewItem from './preview-item'
import { getSecondsFormatted } from '../converters'

export default class ProjectWrapper extends React.PureComponent {

    render() {
        const { id, name, duration, createdAt, updatedAt, loaded, onNameChange, onDelete } = this.props
        return (
            <div className="project-wrapper">
                <PreviewItem
                    className="project-details"
                    mapping={{ duration: 'czas trwania', createdAt: 'utworzono', updatedAt: 'zaktualizowano' }}
                    name={name}
                    loaded={loaded}
                    id={id}
                    duration={getSecondsFormatted(duration)}
                    createdAt={moment(createdAt).format('DD-MM-YYYY hh:mm')}
                    updatedAt={moment(updatedAt).format('DD-MM-YYYY hh:mm')}
                    onNameChange={onNameChange}
                />
                <i className="clickable project-delete icon-trash" title='Usuń projekt' onClick={onDelete}></i>
                <Link to={`/projects/${id}`}><i className="clickable project-mix icon-pencil" title='Przejdź do miksera'></i></Link>
            </div>
        )
    }

}