const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/dataRoute");

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res, next) => {
  res.json({ data: "hello world!" });
});

app.use("/api", router);

app.listen(process.env.PORT || 5000, (err, res) => {
  if (err) console.log(err);
  process.env.NODE_ENV !== "production" && console.log(`listening on port 5000`);
});
