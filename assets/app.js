//Les imports importants
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import Navbar from './js/components/Navbar';
import PrivateRoute from './js/components/PrivateRoute';
import AuthContext from './js/contexts/AuthContext';
import ClientPage from './js/pages/ClientPage';
import FacturesPage from './js/pages/FacturesPage';
import HomePage from './js/pages/HomePage';
import LoginPage from './js/pages/LoginPage';
import AuthApi from './js/services/authApi';
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';


// import ClienPageWithPagination from './js/pages/ClientPageWithPagination';

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log('Hello Webpack Encore! Edit byab me in assets/app.js');

AuthApi.setup();

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthApi.isAuthenticated());
    const NavbarWithRouter = withRouter(Navbar);


    return (
        <AuthContext.Provider value={
            isAuthenticated,
            setIsAuthenticated
        }>
        <HashRouter>
            <NavbarWithRouter />

            <main className="container pt-5">
                <Switch>
                    <Route path="/login" component={LoginPage} />
                    <PrivateRoute path="/clients" component={ClientPage} />
                    <PrivateRoute path="/factures" component={FacturesPage}/>
                    <Route path="/" component={HomePage}/>
                </Switch>
            </main>
        </HashRouter>
        </AuthContext.Provider>
    )
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);
