import React from 'react';
import './App.css';
import MovieFinder from "./containers/MovieFinder/MovieFinder";
import {Switch, Route, Redirect} from 'react-router-dom';

function App() {
  return (
    <div className="App">
        <Switch>
            <Route path="/" exact component={MovieFinder} />
            <Route render={() => <Redirect to="/" />} />
        </Switch>
    </div>
  );
}

export default App;
