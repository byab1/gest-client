import axios from "axios";

function findAll(){
return axios
        .get("http://localhost:8000/api/clients")
        .then(response => response.data["hydra:member"])
}

function find(id){
    return axios
    .get("http://localhost:8000/api/clients/" + id)
    .then(response => response.data);
}

function deleteClient(id){
   return axios
            .delete("http://localhost:8000/api/clients/" + id)
}

function update(id, client){
    return axios.put("http://localhost:8000/api/clients/" + id, client);
}

function create(client){
    return axios.post("http://localhost:8000/api/clients", client);
}

export default {
    findAll: findAll,
    // OU
    // findAll
    delete: deleteClient,
    find,
    update, 
    create
}