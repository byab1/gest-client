import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import ClientsApi from '../services/clientsApi';

const ClientPage = (props) => {

    const [clients, setClients]= useState([]); 
    const [currentPage, setCurrentPage]= useState(1); 
    const [search, setSearch]= useState(""); 

    //permet de recuperer les clients
   const fetchClients = async () => {
        try {
          const data = await ClientsApi.findAll();
           setClients(data);
       } catch (error){
           console.log(error.response);
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
    <h1>Liste des clients</h1>

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
    <tbody>
        {paginatedClients.map(client => (
        <tr key={client.id}>
                <td>{client.id}</td>
                <td><a href="#">{client.nom} {client.prenom}</a></td>
                <td>{client.email}</td>
                <td>{client.entreprise}</td>
                <td className="text-center">
        <span className="badge badge-primary">{client.factures.length}</span>
                </td>
                <td className="text-center">{client.totalMontant.toLocaleString()} $</td>
                <td className="text-center">
                    <a className='btn btn-info btn-xs mr-1' href="#"><span className="glyphicon glyphicon-edit"></span> Edit</a> 
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
    </table>

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