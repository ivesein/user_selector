import React from 'react'
import { Route, Redirect } from "react-router-dom"
import { loggedIn } from "@/utils/toolfunc";


const PrivateRouter = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return loggedIn() ? <Component {...routeProps} /> : <Redirect to="/" />
      }}
    />
  );
}

export default PrivateRouter