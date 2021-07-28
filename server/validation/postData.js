const yup = require("yup");

const dataSchema = yup.object().shape({
  qty: yup.number().positive().required(),
  value: yup.number().positive().required(),
  price: yup.number().positive().required(),
});

module.exports = dataSchema;
