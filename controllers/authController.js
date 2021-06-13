function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

function checkNotAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
};

const login_get = (req, res) => {
    res.render('login', { title: 'Log In'});
};

const log_out = (req, res) => {
    req.logOut();
    res.redirect('/login');
};

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    login_get,
    log_out
}