import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { getProjectsEntries, getProjectsLoaded, getProjectsError, getUserEmail } from '../reducers'
import ProjectWrapper from '../components/project-wrapper'
import * as projectsActions from '../actions/projects'

class ProjectsPage extends React.Component {

    state = {
        newProjectName: ''
    }

    changeNewProjectName = ({ target }) => {
        this.setState({ newProjectName: target.value })
    }

    addNewProject = (e) => {
        e.preventDefault()
        this.props.postProject({ name: this.state.newProjectName })
        this.setState({ newProjectName: '' })
    }
    
    renderPage() {
        const { error, loaded, entries } = this.props
        return (
            <div className={loaded ? '' : 'indeterminate'}>
                <section>
                    <h3>Dostępne utwory</h3>
                    {entries && entries.length ? (
                        <div className="projects">{entries.map(project => <ProjectWrapper {...project}
                            key={project.id}
                            onDelete={() => this.onDelete(project.id)}
                            onNameChange={name => this.onNameChange(project.id, name)}
                        />)}</div>
                    ) : (
                        <p>Brak utworów</p>
                    )}
                </section>
                <section>
                    <h3>Dodawanie nowych projektów</h3>
                    <form onSubmit={this.addNewProject}>
                        <fieldset>
                            <legend>Formularz dodawania projektu</legend>
                            <label>Nazwa projektu: <input type="text" name="newProjectName" required value={this.state.newProjectName} onChange={this.changeNewProjectName} /></label>
                            <button type="submit">Utwórz projekt</button>
                        </fieldset>
                    </form>
                </section>
            </div>
        )
    }

    onNameChange = (id, name) => {
        this.props.patchProject({ name }, id)
    }


    onDelete = id => {
        if (confirm(`Czy na pewno chcesz usunąć projekt ${id}?`)) {
            this.props.deleteProject(id)
        }
    }

    render() {
        return (
            <div>
                <h2>Lista projektów</h2>
                {this.props.userLoggenIn ? this.renderPage() : <p>Musisz się zalogować, aby korzystać z tej strony</p>}
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    entries: getProjectsEntries(state),
    loaded: getProjectsLoaded(state),
    error: getProjectsError(state),
    userLoggenIn: getUserEmail(state)
})

const mapDispatchToProps = {
    patchProject: projectsActions.patchProject,
    deleteProject: projectsActions.deleteProject,
    postProject: projectsActions.postProject
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage)