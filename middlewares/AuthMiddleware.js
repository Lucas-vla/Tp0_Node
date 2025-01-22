// middleware sécu
authenticate = (req, res, next) => {
  if (process.env.PASSWORD !== req.headers.authorization) {
    return res.status(401).json("le pass est incorect");
  }
  next();
};

module.exports = { authenticate };
