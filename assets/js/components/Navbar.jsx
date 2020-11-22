import React, {useContext} from 'react';
import AuthApi from '../services/authApi';
import { NavLink } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext'

const Navbar = ({ history }) => {

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const handleLogout = () => {
        AuthApi.logout();
        setIsAuthenticated(false);
        history.push("/login");
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavLink className="navbar-brand" to="/">SymReact !</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor03">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/clients">Cliens</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/factures">Factures</NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    {(!isAuthenticated && (
                    <>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/register">Inscription</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="btn btn-success mr-1" to="/login">Connexion !</NavLink>
                        </li>
                    </> 
                    )) || (
                    
                    <li className="nav-item">
                        <button 
                        onClick={handleLogout}
                        className="btn btn-danger" 
                        href="#">Deconnexion</button>
                    </li>
                    )}
                </ul>
                
            </div>
        </nav>);
}

export default Navbar;