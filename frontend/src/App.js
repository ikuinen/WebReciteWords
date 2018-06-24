import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import TopAppBar from './TopAppBar'
import ScrollableTabs from './ScrollableTabs'
import LoginCard from './login/LoginCard'
import {BrowserRouter, Route, Switch} from 'react-router-dom';

class App extends Component {

    constructor(props) {
        super(props);
        localStorage.setItem('prefix', 'http://10.214.155.246:8000/api')
    }

    state = {
        auth: false,
    };

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <div className="App">
                        <div>
                            <TopAppBar/>
                        </div>
                        <Switch>
                            <div>
                                <Route exact path={'/'} component={ScrollableTabs}/>
                                <Route path={'/login'} component={LoginCard}/>
                            </div>
                        </Switch>
                    </div>
                </Switch>
            </BrowserRouter>

        );
    }
}

export default App;
