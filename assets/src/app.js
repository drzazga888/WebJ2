import React from 'react'
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'

import Layout from './layout'
import HomePage from './pages/home'
import NotFoundPage from './pages/not-found'
import AudiosPage from './pages/audios'
import DocsPage from './pages/docs'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import ProjectsPage from './pages/projects'
import MixerPage from './pages/mixer'
import ProfilePage from './pages/profile'
import reducer from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, composeEnhancers(applyMiddleware(reduxThunk)))

const App = () => (
    <Provider store={store}>
        <Router basename="webj2">
            <Layout>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/doc" component={DocsPage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <Route path="/profile" component={ProfilePage} />
                    <Route path="/audios" component={AudiosPage} />
                    <Route path="/projects" component={ProjectsPage} />
                    <Route path="/projects/{id}" component={MixerPage} />
                    <Route component={NotFoundPage} />
                </Switch>
            </Layout>
        </Router>
    </Provider>
)

export default App