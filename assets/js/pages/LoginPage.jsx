import React, { useState, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import Authentification from '../services/authApi';

const LoginPage = ({history}) => {

    const { setIsAuthenticated } = useContext(AuthContext);

    const [credentials, setCredentials]= useState({
        username: "",
        password: ""
    }); 

    const [error, setError]= useState("");
    //Gestion des champs
    const handleChange = ({currentTarget}) =>{
        const {value, name}= currentTarget;
        setCredentials({...credentials, [name]: value});
    }

    //Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
           await Authentification.authentification(credentials);
           setError("");
           setIsAuthenticated(true);
           history.replace("/clients");
        } catch(error) {
            setError("Ces informations ne correspondent à aucun utilisateur");
        }
    }
    return ( 
        <>
        <h1>Connexion !</h1>

        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">Adresse Email</label>
                <input 
                value={credentials.username}
                onChange={handleChange}
                type="email" 
                id="username" 
                name="username" 
                placeholder="Adresse email de connexion" 
                className={"form-control" + (error && " is-invalid")}
                />
                {error && <p className="invalid-feedback">{error}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input 
                value={credentials.password}
                onChange={handleChange}
                type="password" 
                placeholder="Mot de passe" 
                id="password" 
                name="password" 
                className="form-control"/>
            </div>
            <div className="form-group">
                <button type="submit" className="btn btn-success">Je me connecte</button>
            </div>
        </form>
        </>
     );
}
 
export default LoginPage   ;
