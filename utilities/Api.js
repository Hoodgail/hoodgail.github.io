import fetch from "node-fetch";
import { Message } from "./Message";

export class Api {

     id = "";
     token = "";

     #version = 9;

     constructor({ token, id } = {}) {
          if (token) this.token = token;
          if (id) this.id = id;
     }

     get headers() {
          return {
               "accept": "*/*",
               "accept-language": "en-US",
               "authorization": this.token,
               "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
               "sec-ch-ua-mobile": "?0",
               "sec-fetch-dest": "empty",
               "sec-fetch-mode": "cors",
               "sec-fetch-site": "same-origin",
               "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzkwLjAuNDQzMC4yMTIgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6IjkwLjAuNDQzMC4yMTIiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6Imh0dHBzOi8vZGlzY29yZC5jb20vIiwicmVmZXJyaW5nX2RvbWFpbiI6ImRpc2NvcmQuY29tIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjg2NDgyLCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ=="
          }
     }

     async createRequest(subpath, { method = "get", query, json = true }) {
          const queryString = new URLSearchParams(query || {}).toString();

          const input = `https://discord.com/api/v${this.#version}${subpath}${query ? ("?" + queryString) : ""}`;

          const request = await fetch(input, { headers: this.headers, method });
          const response = json
               ? await request.json()
               : await request.text()

          return response;
     }

     async createTimeout(ms) {
          return await new Promise(resolve => {
               return setTimeout(() => resolve(), ms)
          })
     }

     async searchMessages({ channel, author_id, offset, parse = true }) {
          const uri = `/channels/${channel}/messages/search`;

          const response = await this.createRequest(uri, {
               query: { offset, author_id },
          });

          return parse
               ? response.messages.flat(1).map(e => new Message(e, this))
               : response
     }

     async messages({ channel, limit = 50 }) {
          const uri = `/channels/${channel}/messages`;

          const messages = await this.createRequest(uri, {
               query: { limit },
          });

          return messages.map(e => new Message(e, this))
     }
}