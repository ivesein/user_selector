import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import PrivateRouter from "@/components/PrivateRouter";
import Home from "@/views/Home";
// import About from "@/views/about";
import NotFound from "@/views/404";
import Login from "@/views/Login";
import TenantList from "@/views/TenantList";

// import TetantLogin from "@/views/TetantLogin";
export default class App extends Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route
						exact
						path="/"
						render={() => <Redirect to="/login" />}
					/>
					<Route exact path="/login" component={Login} />
					<Route exact path="/tenant_list" component={TenantList} />

					{/* <Route exact path="/tenantlogin" component={TetantLogin} /> */}
					<Route path="/admin" component={Home} />
					<Route exact path="*" component={NotFound} />
				</Switch>
			</Router>
		);
	}
}
