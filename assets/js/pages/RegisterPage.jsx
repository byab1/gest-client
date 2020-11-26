import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Fields';
import axios from 'axios';
import UserApi from '../services/userApi';
import { toast } from 'react-toastify';

const RegisterPage = ({history}) => {

    const [user, setUser]= useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });
    const [errors, setErrors]= useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    
      //Gestion des inputs dans le formulaire
    const handleChange =  ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({...user, [name]: value});
    };

    //Gestion de la soumission
    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};

        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm =  "Mot de passe non conforme";
            setErrors(apiErrors);
            toast.error("Oups ! Il y a des erreurs dans votre formulaire");
            return;
        }
        try {
        const response = await UserApi.register(user);
        setErrors({});
        toast.success("Vous êtes désormais inscrit, vous pouvez vous connecter");
        history.replace("/login");
        console.log(response);

        } catch ({response}) {
            const {violations} = response.data;

            if(violations){
                violations.forEach(({propertyPath, message}) => {
                apiErrors[propertyPath] =  message;
                });

                setErrors(apiErrors);
            }
            toast.error("Oups ! Il y a des erreurs dans votre formulaire");
        
        }
    }


    return ( 
        <>
    <h1>Inscription</h1>

    <form onSubmit={handleSubmit}>
            <Field 
            name="nom" 
            label="Nom" 
            placeholder="Votre nom svp" 
            value={user.nom} 
            onChange={handleChange} 
            error={errors.nom} 
            />
            <Field 
            name="prenom" 
            label="Prénom" 
            placeholder="Votre prénom" 
            value={user.prenom} 
            onChange={handleChange} 
            error={errors.prenom} 
            />
            <Field 
            type="email"
            name="email" 
            label="Email" 
            placeholder="Votre adresse email" 
            value={user.email} 
            onChange={handleChange} 
            error={errors.email} 
            />
            <Field 
            name="password" 
            label="Mot de passe" 
            type="password"
            placeholder="Votre mot de passe" 
            value={user.password} 
            onChange={handleChange} 
            error={errors.password} 
            />
            <Field 
            name="passwordConfirm" 
            label="Confirmer votre mot de passe" 
            type="password"
            placeholder="Veuillez confirmer votre mot de passe" 
            value={user.passwordConfirm} 
            onChange={handleChange} 
            error={errors.passwordConfirm} 
            />


           <div className="form-group">
                    <button type="submit" className="btn btn-success">Confirmation</button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte !</Link>
                </div>
        </form>
     </>);
}
 
export default RegisterPage;