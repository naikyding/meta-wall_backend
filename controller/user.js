
const checkToken = async (req, res, next) => {
  res.status(200).send({ status: true, user: req.user })
}

module.exports = { checkToken }
