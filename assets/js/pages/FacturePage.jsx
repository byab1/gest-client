import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Fields';
import Select from '../components/forms/select';
import FormContentLoader from '../components/loader/FormContentLoader';
import ClientApi from '../services/clientsApi';
import FacturesApi from '../services/facturesApi';


const FacturePage = ({history, match}) => {

    const { id = "create"} =  match.params;
    const [loading, setLoading]= useState(true); 


    const [facture, setFacture] = useState({
        montant: "",
        client: "",
        status: "SENT"
    });
    
    const [clients, setClients] = useState([]);
    const [editing, setEditing] = useState(false);

    const [errors, setErrors] =  useState({
        montant: "",
        client: "",
        status: ""
    });

    //Recuperation des clients
    const fetchClients = async () => {
        try {
         const data = await ClientApi.findAll();
         setClients(data);
         setLoading(false);

         if(!facture.client) {
             setFacture({...facture, client: data[0].id});
         } 
        } catch (error) {
            toast.error("Impossible de charger les clients");
            history.replace("/factures");
        }
    }

    //Recuperation d'une facture
    const fetchFacture = async id => {
        try {
            const {montant, status, client} = await FacturesApi.find(id);
            setFacture({montant, status, client: client.id});
            setLoading(false);
        } catch (error) {
            toast.error("Impossible de charger les factures");
            history.replace("/factures");
        }
    }

    useEffect(()=> {
        fetchClients();
    }, []);

    //Récuperation de la bonne facture quand l'ID de l'Url change
    useEffect (() => {
        if(id !== "create") {
            setEditing(true);
            fetchFacture(id);
        }
    }, [id]);


      //Gestion des inputs dans le formulaire
    const handleChange =  ({currentTarget}) => {
        const {name, value} = currentTarget;
        setFacture({...facture, [name]: value});
    };

    //Gestion de la soumission d'une facture
    const handleSubmit = async event => {
        event.preventDefault();

        try {

            if(editing){
                 await FacturesApi.update(id, facture);
                 toast.success("La facture a bien été modifiée !");
            } else {
                 await FacturesApi.create(facture);
                 toast.success("La facture a bien été enregistrée !");
                 history.replace("/factures");
                }
        } catch ({response}) {
            const {violations} = response.data;

            if(violations){
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                apiErrors[propertyPath] =  message;
                });

                setErrors(apiErrors);
                toast.error("Oups ! Erreur survenue ");
            }
        }
    }

    return ( 
    <>
        { (!editing && <h1>Création d'une facture</h1>) || (<h1>Modification de la facture</h1>) }

        {loading && <FormContentLoader/>}

        {!loading && (<form onSubmit={handleSubmit}>
            <Field 
            type="number"
            name="montant" 
            label="Montant" 
            placeholder="Montant de la facture" 
            value={facture.montant} 
            onChange={handleChange} 
            error={errors.montant} 
            />

           <Select name="client" label="Client" value={facture.client} error={errors.client} onChange={handleChange}>
                {clients.map(client => <option key={client.id} value={client.id} >{client.nom} {client.prenom}</option>)}
           </Select>

           <Select name="status" label="Status" value={facture.status} error={errors.status} onChange={handleChange}>
                <option value="SENT">Envoyée</option>
                <option value="PAID">Payée</option>
                <option value="CANCELLED">Annulée</option>
           </Select>

           <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/factures" className="btn btn-link">Retour à la liste</Link>
                </div>
        </form>)}

        
    </> 
    );
}
 
export default FacturePage;