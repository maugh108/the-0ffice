const db = require('./db/connection.js');
const express = require('express');
const startInquirer = require('./lib/inquirer');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res) => {
  res.status(404).end();
});

db.connect(err => {
  if (err) throw err;
  console.log("\n");
  console.log('la bashe de datosh ah shido actualizada perdón, conectada.');
  console.log("\n");
  app.listen(PORT, () => {
    console.log(`Now listening on port: ${PORT}`);
    console.log("\n");
    startInquirer();
  });
});