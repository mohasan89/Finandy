const path = require("path");
const fs = require("fs");
const valSchema = require("../validation/postData");

exports.postData = async (req, res, next) => {
  const data = req.body;
  await valSchema
    .validate(data, { abortEarly: false })
    .then((results) => {
      return fs.readFile(path.join(__dirname, "..", "data.json"), "utf-8", (err, fileData) => {
        if (err) return res.status(500).json({ message: "cant read file" });

        const obj = JSON.parse(fileData);
        obj.unshift(data);
        const configDirectory = path.resolve(process.cwd(), "config");
        console.log(configDirectory);
        fs.writeFile(
          path.join(__dirname, "..", "data.json"),
          JSON.stringify(obj, null, 3),
          (err) => {
            if (err) {
              return res.status(500).json({ message: "cant write file" });
            } else {
              return res.status(201).json({ message: "created" });
            }
          }
        );
      });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(400).json({ message: err.errors || err.message });
    });
};

exports.getData = (req, res, next) => {
  fs.readFile(path.join(__dirname, "..", "data.json"), "utf-8", (err, fileData) => {
    if (err) return res.status(500).json({ message: "cant read file" });

    const obj = JSON.parse(fileData);
    return res.status(200).json({ data: obj });
  });
};
