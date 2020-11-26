import axios from "axios";

function findAll(){
return axios
        .get("http://localhost:8000/api/factures")
        .then(response => response.data["hydra:member"])
}

function find(id) {
    return axios.get("http://localhost:8000/api/factures/" + id)
            .then(response => response.data);
}

function deleteFacture(id){
   return axios
            .delete("http://localhost:8000/api/factures/" + id)
}

function update(id, facture){
    return axios.put(
        "http://localhost:8000/api/factures/" + id, 
        { ...facture, client: `/api/clients/${facture.client}` }
     );
}

function create(facture){
    return axios.post("http://localhost:8000/api/factures", {
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