
const {postLoanApp, findLoan, processLoan} = require('../controllers/loansController');

exports.loanApply = async (req, res, next) => {

    const result = await postLoanApp(req);
    await processLoan(req.body.email);
    res.json(result);
    console.log('result '+ result);

}

exports.getStatus = async (req, res, next) => {

    const result = await findLoan(req);
    console.log('get status '+ result);
    res.json(result);

}