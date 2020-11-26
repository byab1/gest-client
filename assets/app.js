//Les imports importants
import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from './js/components/Navbar';
import AuthContext from './js/contexts/AuthContext';
import ClientPage from './js/pages/ClientPage';
import CreateClientPage from './js/pages/CreateClientPage';
import FacturePage from './js/pages/facturePage';
import FacturesPage from './js/pages/FacturesPage';
import HomePage from './js/pages/HomePage';
import LoginPage from './js/pages/LoginPage';
import RegisterPage from './js/pages/RegisterPage';
import AuthApi from './js/services/authApi';
import 'react-toastify/dist/ReactToastify.css';
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

const PrivateRoute = ({ path, component }) => {
    const {isAuthenticated} = useContext(AuthContext);

    return isAuthenticated ? (
        <Route path={path} component={component} />
    ) : (
        <Redirect to="/login" />
    );
}

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthApi.isAuthenticated());
    const NavbarWithRouter = withRouter(Navbar);

    const contextValue = {
        isAuthenticated,
        setIsAuthenticated
    }

    return (
        <AuthContext.Provider value={ contextValue }>
            <HashRouter>
                <NavbarWithRouter />

                <main className="container pt-5">
                    <Switch>
                        <PrivateRoute path="/factures/:id" component={FacturePage} />
                        <PrivateRoute path="/clients/:id" component={CreateClientPage} />
                        <PrivateRoute path="/clients" component={ClientPage} />
                        <PrivateRoute path="/factures" component={FacturesPage}/>
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                        <Route path="/" component={HomePage}/>
                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
        </AuthContext.Provider>
    )
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);
