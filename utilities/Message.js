export class Message {

     id = "";
     channelId = "";
     timestamp = "";
     content = "";

     #api = null;

     constructor(message, api) {
          this.id = message.id;
          this.channelId = message.channel_id;
          this.timestamp = message.timestamp;
          this.content = message.content;

          this.#api = api;
     }

     async delete(ms) {

          if (ms) await this.#api.createTimeout(ms);

          const uri = `/channels/${this.channelId}/messages/${this.id}`;

          const request = await this.#api.createRequest(uri, {
               method: "delete",
               json: false
          });

          if (request) return JSON.parse(request);

          return request;
     }

     createTime() {
          const date = new Date(this.timestamp)

          const timeString = date.toLocaleTimeString();
          const dateString = date.toDateString();

          const string = `${timeString} / ${dateString}`;

          return string;
     }

}