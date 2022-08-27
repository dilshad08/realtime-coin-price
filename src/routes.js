  // router middleware

  const router = require("express").Router();

  router.get('/', (req, res, next) => {
    res.send('Worked')
  })
  
  module.exports = router;