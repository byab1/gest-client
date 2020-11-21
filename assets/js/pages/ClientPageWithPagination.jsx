import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';

const ClienPageWithPagination = (props) => {

    const [clients, setClients]= useState([]); 
    const [totalItems, setTotalItems]= useState(0); 
    const [currentPage, setCurrentPage]= useState(1); 
    const itemsPerPage = 10;

    useEffect(()=>{
        axios
        .get(`http://localhost:8000/api/clients?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
        .then(response => {
           setClients(response.data["hydra:member"]);
           setTotalItems(response.data["hydra:totalItems"]);
        })
        .catch(error=> console.log(error.response));

    }, [currentPage]);

    const handleDelete = (id) =>{

        const clientOriginal = [...clients];
        // L'approche optimiste
        setClients(clients.filter(client => client.id !== id));

        // L'approche pessimiste
        axios
            .delete("http://localhost:8000/api/clients/" + id)
            .then(response => console.log("ok"))
            .catch(error => {
                setClients(clientOriginal);
                console.log(error.response);
            } );
                
    };

    const handlePageChange = page => {
        setClients([]);
        setCurrentPage(page);
    }

    const paginatedClients = Pagination.getData(clients, currentPage, itemsPerPage);


    return (  

    <>
    <h1>Liste des clients Pargination</h1>

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
        {clients.length === 0 && <tr><td>Chargement...</td></tr>}
        {clients.map(client => (
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
                    <a className='btn btn-info btn-xs' href="#"><span className="glyphicon glyphicon-edit"></span> Edit</a> 
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

<Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems} 
onPageChange={handlePageChange} />
    
    </> 
    );
}
 
export default ClienPageWithPagination;