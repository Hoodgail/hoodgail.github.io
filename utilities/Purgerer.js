import Color from "../src/interface/Color.js";
import StringUtil from "../src/interface/StringUtil.js";
import { Api } from "./Api.js";
import { Message } from "./Message.js";

export class Purgerer extends Api {

     defaultTimeout = 300;

     channelId = "";

     constructor() {
          super(...arguments);
     }

     line({ name, content, end = true }, onLog) {

          if (onLog) onLog(name, content, end);

          return console.log(`[${name}] `, content);

     }

     async init({ log = true, onLog, offset = 0 }) {

          const result = await this.searchMessages({ channel: this.channelId, offset, author_id: this.id, parse: false })

          const messages = result.messages.flat(1).map(e => new Message(e, this))

          this.line({
               name: "messages".fontcolor("white"),
               content: messages.length.toString().fontcolor("#79b8ff"),
               end: true
          }, onLog);

          for (let index in messages) {

               const message = messages[index];

               await this.createTimeout(this.defaultTimeout);

               const request = await message.delete();

               if (request.retry_after) {

                    this.defaultTimeout += 50;

                    this.line({
                         name: "timeout".fontcolor("white"),
                         content: request.message + ` ${request.retry_after.toString().fontcolor("#79b8ff")} sec`.fontcolor("#ff3e3e"),
                         end: true
                    }, onLog);

                    this.line({
                         name: "Default timeout".fontcolor("gold"),
                         content: `${this.defaultTimeout.toString().fontcolor("#79b8ff")} ${"ms".fontcolor("#eb4e3e")}`,
                         end: true
                    }, onLog);

                    await this.createTimeout(request.retry_after * 1000);
                    await message.delete();

               } else {

                    let progress = new StringUtil(
                         Math.floor(((index + 1) / messages.length) * 10).toString().fontcolor("#79b8ff") + "%".fontcolor("#eb4e3e")
                    ).padding(5);

                    let content = new StringUtil(
                         message.content
                    ).padding(25);

                    this.line({
                         name: "deleted".fontcolor("white"),
                         content: `${progress} | ${content} ${message.createTime().fontcolor("white")}`,
                         end: true
                    }, onLog);
               }
          }

          return result;
     }
}
