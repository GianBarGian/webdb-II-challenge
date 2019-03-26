function error (err, req, res, next) {
    res.status(err.status).json(err.message);
}

module.exports = {
    error,
}