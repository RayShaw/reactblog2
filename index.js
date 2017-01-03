import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexRedirect, IndexLink, browserHistory } from 'react-router'


class App extends Component {
    render() {
        return <div>
            <h1>App</h1>

            <ul>
                <li><IndexLink to="/" activeStyle={{color: 'red'}}>Home</IndexLink></li>
                <li><Link to="/about" activeStyle={{color: 'red'}}>About</Link></li>
                <li><Link to="/inbox" activeStyle={{color: 'red'}}>Inbox</Link></li>
            </ul>
            {this.props.children}
        </div>
    }
}


class About extends Component {
    render() {
        return <h3>About Component</h3>
    }
}


class Inbox extends Component {
    render() {
        return <div>
            <h2>Inbox</h2>
            {this.props.children || "Welcome to your Inbox"}
        </div>
    }
}

class Message extends Component {
    render() {
        return <h3>Message {this.props.params.id}</h3>
    }
}

class Dashboard extends Component {
    render() {
        return <div>Welcome to the app!</div>
    }
}

class Welcome extends Component {
    render() {
        return <div>Welcome Welcome Welcome</div>
    }
}

render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Dashboard} />
            <IndexRedirect to="welcome"/>
            <Route path="welcome" component={Welcome} />
            <Route path="about" component={About} />
            <Route path="inbox" component={Inbox} >
                 <Route path="/messages/:id" component={Message} />
                 <Redirect from="messages/:id" to="/messages/:id" />
            </Route>
        </Route>
    </Router>
), document.getElementById('app'));