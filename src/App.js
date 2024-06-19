import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import SignUp from './components/login/SignUp';
import Profile from './components/profile/Profile';
import UserList from './components/users/UserList';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

const App = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <AuthProvider>
                <Header />
                <div className="container">
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={SignUp} />
                        <ProtectedRoute path="/" exact component={Dashboard} />
                        <ProtectedRoute path="/profile" component={Profile} />
                        <ProtectedRoute path="/users" component={UserList} />
                    </Switch>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;
