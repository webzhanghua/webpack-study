'use strict'

import React from 'react'
import ReactDom from 'react-dom'
// import './search.css'
import './search.less'
import '../../common'
import { a } from './tree-shaking'
import logo from './img/logo.png'
import largeNumTest from 'large-num-test'
if (false) {
    a()
}
let b = 100
class Search extends React.Component {
    constructor() {
        super(...arguments)
        this.state = {
            Text: null
        }
    }
    loadComponent () {
        import('./text.js').then((Text) => {
            this.setState({
                Text: Text.default
            })
        })
    }
    render () {
        const { Text } = this.state
        return <div class="search-text">
            Search Text content99988877766
            {
                Text ? <Text /> : null
            }{
                largeNumTest('99', 1)
            }
            <img onClick={this.loadComponent.bind(this)} src={logo} />
        </div>
    }
}

ReactDom.render(
    <Search></Search>,
    document.getElementById('root')
)

