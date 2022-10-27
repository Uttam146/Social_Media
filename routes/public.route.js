const { signUp, verify,login,forgotPassword,resetPassword} = require('../controllers/publicController');
const routes = (app) => {
    app.post('/signup', signUp);
    app.post('/verify',verify);
    app.post('/login',login);
    app.post('/forgotpassword',forgotPassword);
    app.post('/resetpassword',resetPassword);
}

module.exports = routes;