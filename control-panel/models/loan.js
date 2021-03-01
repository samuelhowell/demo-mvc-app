const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LoanSchema = new Schema (
  {
    loanid: {type: String, required: true},
    name: {type: String, required: true, minlength: 5, maxlength: 20, lowercase: true},
    email: {type: String, required: true, minlength: 5, maxlength: 20, lowercase: true},
    ssn: {type: String, minlength: 9, maxlength:9, required: true},
    amount: {type: Number, required: true},
    status: {type: String, required: true, lowercase: true, minlength: 2, maxlength: 20},
    salt: {type: String, required: true},

  }
);

module.exports = mongoose.model('Loan', LoanSchema);