import axios from "axios";
import Cache from "./cache";
import {CLIENTS_API} from "./config";

async function findAll() {

    const cachedClients = await Cache.get("clients");

    if(cachedClients){
        return cachedClients;
    } 
return axios
        .get(CLIENTS_API)
        .then(response => {
            const clients = response.data["hydra:member"];
            Cache.set("clients", clients);
            return clients;
        });
}

async function find(id){
    const cachedClients = await Cache.get("clients." + id);
    if(cachedClients){
        return cachedClients;
    } 
    return axios
    .get(CLIENTS_API + "/" + id)
    .then(response => {
        const client = response.data;
        Cache.set("clients." + id, client);
        return client;
    });
}

function deleteClient(id){
   return axios
            .delete(CLIENTS_API + "/" + id).then(async response => {
                const cachedClients = await Cache.get("clients");
                if(cachedClients){
                    Cache.set("clients", cachedClients.filter(c => c.id !== id));
                } 
                return response;
            });
}

function update(id, client){
    return axios.put(CLIENTS_API + "/" + id, client).then(async response => {
                const cachedClients = await Cache.get("clients");
                const cachedClient = await Cache.get("clients." + id);

                if(cachedClient) {
                    Cache.set("clients." + id, response.data);
                }

                if(cachedClients){
                    const index =  cachedClients.findIndex(c => c.id == id);
                    cachedClients[index] = response.data;
                    // const newCachedClients = response.data;
                    // cachedClients[index] = newCachedClients;
                    // Cache.set("clients", cachedClients);
                } 
                return response;
            });;
}

function create(client){
    return axios.post(CLIENTS_API, client).then(async response => {
                const cachedClients = await Cache.get("clients");
                if(cachedClients){
                    Cache.set("clients", [...cachedClients, response.data]);
                } 
                return response;
            });;
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