import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import './App.css';

import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import Orders from './components/Landing-Page/pages/Orders';
import PasswordUpdate from './pages/PasswordUpdate';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <LoginPage />
        </Route>
        <Route path="/cards" exact>
          <Orders />
        </Route>
        <Route path="/register" exact>
          <RegisterPage />
        </Route>
        <Route path="/update_password" exact>
          <PasswordUpdate />
        </Route>
        <Route path="/forgot_password" exact>
          <ForgotPassword />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;