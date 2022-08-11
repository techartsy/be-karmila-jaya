require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./src/routes");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.get("/", (err, res) => {
  res.send("Server Connected");
});

app.listen(port, () => console.log(`Your server running on ${port}`));
