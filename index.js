import express from "express";

const app = express();

app.use("/", express.static("public"));

app.listen(2005, () => console.log("http://localhost:2005/"));