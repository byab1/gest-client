import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import Field from '../components/forms/Fields';
import AuthContext from '../contexts/AuthContext';
import AuthApi from '../services/authApi';

const LoginPage = ({ history }) => {

    const { setIsAuthenticated } = useContext(AuthContext);

    const [credentials, setCredentials]= useState({
        username: "",
        password: ""
    }); 

    const [error, setError]= useState("");

    //Gestion des champs
    const handleChange = ({currentTarget}) => {
        const { value, name } = currentTarget;
        setCredentials({ ...credentials, [name]: value});
    }

    //Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
             await AuthApi.authentificate(credentials);
             setError("");
           setIsAuthenticated(true);
           toast.success("Vous êtes désormais connecté !");
           history.replace("/clients");
        } catch (error) {
            setError("Ces informations ne correspondent à aucun utilisateur");
            toast.error("Une erreur est survenue");
        }
    }

    return ( 
        <>
        <h1>Connexion !</h1>

        <form onSubmit={handleSubmit}>
            {/* 2eme methode factorisation du formulaire */}

            <Field label="Adresse email" name="username" 
            value={credentials.username} onChange={handleChange} 
            placeholder="Adresse email de connexion" error={error} />

            <Field label="Mot de passe" name="password" 
            value={credentials.password} onChange={handleChange} 
            type="password" error="" />

            {/* 1ere methode */}
            {/* <div className="form-group">
                <label htmlFor="username">Adresse email</label>
                <input
                    value={ credentials.username }
                    onChange={  handleChange }
                    type="email"
                    placeholder="Adresse email de connexion"
                    name="username"
                    id="username"
                    className={"form-control" + (error && " is-invalid")}
                 />
                 {error && <p className="invalid-feedback">{error}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="username">Mot de passe</label>
                <input
                    value={ credentials.password }
                    onChange={  handleChange }
                    type="password"
                    placeholder="Mot de passse"
                    name="password"
                    id="password"
                    className="form-control"
                 />
            </div> */}
            <div className="form-group">
                <button type="submit" className="btn btn-success">Je me connecte</button>
            </div>
        </form>
        </>
     );
}
 
export default LoginPage   ;
