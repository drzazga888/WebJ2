import React from 'react'
import { Link } from 'react-router-dom'

export default class ProjectsPage extends React.Component {

    deleteProject(id, e) {
        e.preventDefault()
        console.log('TODO', id)
    }

    onFieldChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }

    createProject = e => {
        e.preventDefault()
        console.log('TODO', id)
    }

    _renderProject({ id, name }) {
        <li>
            <a href="javascript:void(0)" onClick={this.deleteProject.bind(this, id)} className="icon-trash deleter">Usuń</a>
            <Link to={`/projects/${id}`}><small>#{id}</small> {name}</Link>
        </li>
    }

    render() {
        return (
            <div>
                <h2>Lista projektów</h2>
                <section>
                    <h3>Dostępne utwory</h3>
                    {this.props.projects && this.props.projects.length ? (
                        <ul className="deletable-list">
                            {this.props.projects.map(project => this._renderProject(project))}
                        </ul>
                    ) : (
                        <p>Brak utworów</p>
                    )}
                    <a href="javascript:void(0)" onClick={this.createProject}><button className="icon-plus">Dodaj nowy utwór</button></a>
                </section>
            </div>
        )
    }

}