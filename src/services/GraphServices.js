import axios from "axios";
export default class GraphServices {
    #baseUrl = "http://localhost:5000/";
    #API;

    constructor() {
        this.#API = axios.create({
            baseURL:this.#baseUrl
        });
    }

     async getAllPath(graph,node){
        return await this.#API.post(`path`,{graph,node});
    }

}
