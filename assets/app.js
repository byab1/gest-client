//Les imports importants
import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './js/components/Navbar';
import HomePage from './js/pages/HomePage';
import { HashRouter, Switch, Route} from 'react-router-dom';

/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';
import ClientPage from './js/pages/ClientPage';
import FacturesPage from './js/pages/FacturesPage';
// import ClienPageWithPagination from './js/pages/ClientPageWithPagination';

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log('Hello Webpack Encore! Edit byab me in assets/app.js');

const App = () => {
    return (
        <HashRouter>
            <Navbar />

            <main className="container pt-5">
                <Switch>
                    <Route path="/clients" component={ClientPage}/>
                    <Route path="/factures" component={FacturesPage}/>
                    <Route path="/" component={HomePage}/>
                </Switch>
            </main>
        </HashRouter>
    )
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);
