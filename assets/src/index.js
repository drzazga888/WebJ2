import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'

import initializeStore from './initialize-store'
import App from './app'

const store = initializeStore()

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'))