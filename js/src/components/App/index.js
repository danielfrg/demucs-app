import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Convert from "../Convert";
import ResultTable from "../Results";

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={(props) => <Convert {...props} />}
                    ></Route>
                    <Route
                        path="/s/:id"
                        render={(props) => <ResultTable {...props} />}
                    ></Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
