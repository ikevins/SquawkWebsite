import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import './App.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Orders from './components/Landing-Page/pages/Orders';
import PasswordUpdate from './pages/PasswordUpdate';
import ForgotPassword from './pages/ForgotPassword';
import Verification from './pages/EmailConfirmation';
import UserStuff from './pages/UserStuff';


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <LoginPage />
        </Route>
        <Route path="/dashboard" exact>
          <Orders />
        </Route>
        <Route path="/login" exact>
          <LoginPage />
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
        <Route path="/Verification" exact>
          <Verification />
        </Route>
        <Route path="/location" exact>
          <UserStuff />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;