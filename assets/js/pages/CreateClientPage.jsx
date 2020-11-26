import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Fields';
import FormContentLoader from '../components/loader/FormContentLoader';
import ClientsApi from '../services/clientsApi'

const CreateClientPage = ({history, match}) => {

    const { id = "create"} =  match.params;

    const [client, setClient] = useState({
        nom: "",
        prenom: "",
        email: "",
        entreprise: ""
    });
    const [errors, setErrors] = useState({
        nom: "",
        prenom: "",
        email: "",
        entreprise: ""
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading]= useState(false); 

    //Récuperation du client en fonction de l'identifiant
    const fetchClient = async id => {
        try {
            const { nom, prenom, email, entreprise } = await ClientsApi.find(id);

            setClient({ nom, prenom, email, entreprise });
            setLoading(false);
        } catch (error) {
            toast.error("Le client n'a pas pu être chargé")
            history.replace("/clients");
        }
    }

    //Chargment du client si besoin au chargment du composant ou au chargement de l'identifiant
    useEffect (()=> {
        if(id !== "create") {
            setLoading(true);
            setEditing(true);
            fetchClient(id);
        }  
    }, [id]);

    //Gestion des inputs dans le formulaire
    const handleChange =  ({currentTarget}) => {
        const {name, value} = currentTarget;
        setClient({...client, [name]:value});
    };

    //Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setErrors({}); 

            if (editing) {
                await ClientsApi.update(id, client);
                toast.success("Le client a bien été modifié")
            } else {
                await ClientsApi.create(client);
                toast.success("Le client a bien été créé")
                history.replace("/clients");
            }
        } catch ({response}) {
            // if (error.response.data.violations) {
            //     const apiErrors = {};
            //     error.response.data.violations.forEach(violation => {
            //         apiErrors[violation.propertyPath] = violation.message;
            //     });
            //     setErrors(apiErrors);
            //     console.log(apiErrors);
            //     toast.error("Oups ! Il y a des erreurs dans votre formulaire");
            // }

            //FACTORISATION 

            const {violations} = response.data;
            if(violations){
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                apiErrors[propertyPath] =  message;
                });

                setErrors(apiErrors);
                toast.error("Oups ! Il y a des erreurs dans votre formulaire")
            }
        }
    };

    return ( 
        <>
            { (!editing && <h1>Créer un client</h1>) || (<h1>Modification du client</h1>) }

            {loading && <FormContentLoader/>}

            {!loading && (<form onSubmit={handleSubmit}>
                <Field 
                name="nom" 
                label="Nom de famille" 
                placeholder="Nom de famille du client" 
                value={client.nom} onChange={handleChange}
                error={errors.nom} />
                <Field 
                    name="prenom" 
                    label="Prénom" 
                    placeholder="Prénom du client" 
                    value={client.prenom} 
                    onChange={handleChange} 
                    error={errors.prenom} 
                />
                <Field name="email" label="Email" placeholder="Adresse email du client" value={client.email} onChange={handleChange} error={errors.email} type="email" />
                <Field name="entreprise" label="Entreprise" placeholder="Entreprise du client" value={client.entreprise} onChange={handleChange} error={errors.entreprise} />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/clients" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>)}
        </>
     );
}
 
export default CreateClientPage;