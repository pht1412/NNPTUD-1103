var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  let result = await userModel.find({
    isDeleted: false
  }).populate({
    path: 'role',
    select: 'name'
  })
  res.send(result);
});

router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findById(id);
    if (!result || result.isDeleted) {
      res.status(404).send({
        message: "ID NOT FOUND"
      });
    } else {
      res.send(result)
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});

router.post('/', async function (req, res, next) {
  let newUser = new userModel({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    role: req.body.role
  })
  await newUser.save();
  res.send(newUser)
})

router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findByIdAndUpdate(
      id, req.body, {
      new: true
    })
    res.send(result)
  } catch (error) {
    res.status(404).send(error)
  }
})

router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findById(id);
    if (!result || result.isDeleted) {
      res.status(404).send({
        message: "ID NOT FOUND"
      });
    } else {
      result.isDeleted = true;
      await result.save();
      res.send(result)
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
})

router.post('/enable', async function (req, res, next) {
  let result = await userModel.findOneAndUpdate({
    username: req.body.username,
    email: req.body.email
  }, {
    status: true
  }, {
    new: true
  })
  res.send(result)
})

router.post('/disable', async function (req, res, next) {
  let result = await userModel.findOneAndUpdate({
    username: req.body.username,
    email: req.body.email
  }, {
    status: false
  }, {
    new: true
  })
  res.send(result)
})

module.exports = router;
