import React from 'react';
// import logo from './logo.svg';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import ToolsComponent from './components/tools-add/ToolsComponent';
import ToolsList from './components/tools-view/ToolsList';

import './assets/styles/App.css';
import './assets/styles/flipComponent.css';
import './assets/styles/toolsComponent.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={ToolsComponent} />
          <Route exact path="/viewTools" component={ToolsList} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
