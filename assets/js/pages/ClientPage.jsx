import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import ClientsApi from '../services/clientsApi';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../components/loader/TableLoader';

const ClientPage = (props) => {

    const [clients, setClients]= useState([]); 
    const [currentPage, setCurrentPage]= useState(1); 
    const [search, setSearch]= useState(""); 
    const [loading, setLoading]= useState(true); 

    //permet de recuperer les clients
   const fetchClients = async () => {
        try {
          const data = await ClientsApi.findAll();
           setClients(data);
           setLoading(false);
       } catch (error){
           toast.error("Impossible de charger les clients");
       }
   }
//Rechercher les clients au chargement du component
    useEffect(() => {
       fetchClients();
    },[]);

    //Gestion de la suppression d'un client
    const handleDelete = id => {

        const clientOriginal = [...clients];
        // L'approche optimiste
        setClients(clients.filter(client => client.id !== id));

        // L'approche pessimiste

        // try {
        //     await ClientsApi.delete(id);
        // } catch(error) {
        //     setClients(clientOriginal);
        //     console.log(error.response);
        // }
        //2E Methode 
        ClientsApi.delete(id)
           .then(response => console.log("ok"))
           .catch(error => {
               setClients(clientOriginal);
               console.log(error.response);
           } );
           toast.success("Le client a bien été supprimé")
                
    };

    //Gestion du changement de page
    const handlePageChange = page => {
        setCurrentPage(page);
    };
    //Permet de faire une recherche
    const handleSearch = ({currentTarget}) =>{
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };
//Filtrage des client en fonction de la recherche
    const filteredClients = clients.filter(
        c =>
        c.prenom.toLowerCase().includes(search.toLowerCase())||
        c.nom.toLowerCase().includes(search.toLowerCase())||
        c.email.toLowerCase().includes(search.toLowerCase())||
        (c.entreprise && c.entreprise.toLowerCase().includes(search.toLowerCase()))
        
    );
    const itemsPerPage = 10;

    //Pagination des données
    const paginatedClients = 
    filteredClients.length > itemsPerPage 
    ? Pagination.getData(
        filteredClients, 
        currentPage, 
        itemsPerPage): filteredClients;


    return (  
    <>
    <div className="mb-3 d-flex justify-content-between align-items-center">
    <h1>Liste des clients</h1>
    <Link to="/clients/create" className="btn btn-primary">
        Créer un client
    </Link>

    </div>

    <div className="form-group">
        <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
    </div>

    <table className="table table-hover">
    <thead>
        <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant Total</th>
            <th className="text-center">Action</th>
        </tr>
    </thead>
    { !loading && ( <tbody>
        {paginatedClients.map(client => (
        <tr key={client.id}>
                <td>{client.id}</td>
                <td><Link to={"/clients/" + client.id}>{client.nom} {client.prenom}</Link></td>
                <td>{client.email}</td>
                <td>{client.entreprise}</td>
                <td className="text-center">
        <span className="badge badge-primary">{client.factures.length}</span>
                </td>
                <td className="text-center">{client.totalMontant.toLocaleString()} $</td>
                <td className="text-center">
                    <Link to={"/clients/" + client.id} className='btn btn-primary btn-xs mr-1'><span className="glyphicon glyphicon-edit"></span> Edit</Link>
                    <button
                        onClick={()=> handleDelete(client.id)}  
                        className="btn btn-danger btn-xs" 
                        disabled={client.factures.length >0}>
                        <span className="glyphicon glyphicon-remove"></span> Del
                    </button>
                </td>
            </tr>
        ))}
            
    </tbody>
    )}
    </table>

    {loading && <TableLoader/>}

{itemsPerPage < filteredClients.length && <Pagination 
currentPage={currentPage} 
itemsPerPage={itemsPerPage} 
length={filteredClients.length} 
onPageChange={handlePageChange} 
/>}
    
    </> 
    );
}
 
export default ClientPage;