

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.host}.${req.originalUrl}`);
    next();
}
// to set logger be visible in other files
module.exports = logger