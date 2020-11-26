import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import moment from 'moment';
import FactureApi from '../services/facturesApi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../components/loader/TableLoader';

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
    const [loading, setLoading]= useState(true); 
    const itemsPerPage = 10;
    
    //Recuperation des factures aupres de l'API
    const fetchFactures = async () => {
        try {

            const data = await FactureApi.findAll()
            setFactures(data);
            setLoading(false);
        } catch (error) {
            toast.error("Erreur lors du chargement des factures !"); 
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
            toast.success("La facture a bien été supprimée");
        } catch(error) {
            toast.error("Une erreur est survenue !");
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
        <div className="mb-3 d-flex justify-content-between align-items-center">
            <h1>Liste des factures</h1>
            <Link to="/factures/create" className="btn btn-primary">
                Créer une facture
            </Link>

        </div>

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
    {!loading && (<tbody>
        {paginatedFactures.map(facture => (
        <tr key={facture.id}>
                <td>{facture.chrono}</td>
                <td><Link  to={"/factures/" + facture.id}>{facture.client.nom} {facture.client.prenom}</Link ></td>
                <td className="text-center">{formaDate(facture.envoyeLe)}</td>
                <td className={"badge badge-" + STATUS_CLASSES[facture.status]}>{STATUS_LABELS[facture.status]}</td>
                <td className="text-center">{facture.montant.toLocaleString()} $</td>
                <td className="text-center">
                    <Link to={"/factures/" + facture.id} className='btn btn-primary btn-xs mr-1' href="#"><span className="glyphicon glyphicon-edit"></span> Edit</Link> 
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
    )}
    </table>

    {loading && <TableLoader/>}

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