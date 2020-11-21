import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import moment from 'moment';
import FactureApi from '../services/facturesApi';

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "info",
    CANCELED: "warning"
}
const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELED: "Annulée"
}

const FacturesPage = (props) => {

    const [factures, setFactures]= useState([]); 
    const [currentPage, setCurrentPage]= useState(1); 
    const [search, setSearch]= useState(""); 
    const itemsPerPage = 10;
    
    //Recuperation des factures aupres de l'API
    const fetchFactures = async () => {
        try {

            const data = await FactureApi.findAll()
            setFactures(data);
        } catch (error) {
            console.log(error.response); 
        }
    }
    //Charger les factures au chargement du composant
     useEffect(() => {
        fetchFactures();
    }, []);

    //Gestion du changement de page
    const handlePageChange = page => {
        setCurrentPage(page);
    };
    //Permet de faire une recherche
    const handleSearch = ({currentTarget}) =>{
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };
 
    //Gestion de la suppression d'une facture
    const handleDelete = async id =>{
        const facturesOriginal = [...factures];
        setFactures(factures.filter(facture => facture.id !== id));

        try {
            await FactureApi.delete(id);
        } catch(error) {
            setFactures(facturesOriginal);
            console.log(error.response);
        }
    }

//Gestion du format de Date
    const formaDate = str => moment(str).format("DD/MM/YYYY");

//Filtrage des factures en fonction de la recherche
    const filteredFactures = factures.filter(
        f =>
        f.client.prenom.toLowerCase().includes(search.toLowerCase())||
        f.client.nom.toLowerCase().includes(search.toLowerCase()) ||
        f.montant.toString().startsWith(search.toLowerCase()) ||
        STATUS_LABELS[f.status].toLowerCase().includes(search.toLowerCase())
        
        
    );
//Pagination des données
    const paginatedFactures = 
    // filteredFactures.length > itemsPerPage 
     Pagination.getData(
        filteredFactures, 
        currentPage, 
        itemsPerPage);
    return ( 
        <>
        <h1>Liste des factures</h1>

        <div className="form-group">
        <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
    </div>

         <table className="table table-hover">
    <thead>
        <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoie</th>
            <th className="text-center">Status</th>
            <th className="text-center">Montant Total</th>
            <th className="text-center">Action</th>
        </tr>
    </thead>
    <tbody>
        {paginatedFactures.map(facture => (
        <tr key={facture.id}>
                <td>{facture.chrono}</td>
                <td><a href="#">{facture.client.nom} {facture.client.prenom}</a></td>
                <td className="text-center">{formaDate(facture.envoyeLe)}</td>
                <td className={"badge badge-" + STATUS_CLASSES[facture.status]}>{STATUS_LABELS[facture.status]}</td>
                <td className="text-center">{facture.montant.toLocaleString()} $</td>
                <td className="text-center">
                    <a className='btn btn-info btn-xs mr-1' href="#"><span className="glyphicon glyphicon-edit"></span> Edit</a> 
                    <button
                        className="btn btn-danger btn-xs" 
                        onClick={()=> handleDelete(facture.id )}
                        >
                        <span className="glyphicon glyphicon-remove"></span> Del
                    </button>
                </td>
            </tr>
        ))}
            
    </tbody>
    </table>

    <Pagination 
currentPage={currentPage} 
itemsPerPage={itemsPerPage} 
length={filteredFactures.length} 
onPageChange={handlePageChange} 
/>
        </>
     );
}
 
export default FacturesPage;