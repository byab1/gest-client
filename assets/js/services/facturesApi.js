import axios from "axios";
import { FACTURES_API } from "./config";

function findAll(){
return axios
        .get(FACTURES_API)
        .then(response => response.data["hydra:member"])
}

function find(id) {
    return axios.get(FACTURES_API + "/" + id)
            .then(response => response.data);
}

function deleteFacture(id){
   return axios
            .delete(FACTURES_API + "/" + id)
}

function update(id, facture){
    return axios.put(
        FACTURES_API + "/" + id, 
        { ...facture, client: `/api/clients/${facture.client}` }
     );
}

function create(facture){
    return axios.post(FACTURES_API, {
                    ...facture, client: `/api/clients/${facture.client}`
                });
}

export default {
    findAll: findAll,
    // OU
    // findAll
    delete: deleteFacture,
    find,
    update, 
    create
}