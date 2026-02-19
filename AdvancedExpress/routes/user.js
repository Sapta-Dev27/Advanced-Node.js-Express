import { Router } from "express";
import { query, body, param, validationResult } from 'express-validator'

import loggingMiddleware from "../middlewares/logging.js";
import checkingUserID from "../middlewares/checkingUser.js";

//users array
const users = [
  {
    id: 1,
    email: 'sapta1@gmail.com',
    userName: 'SaptaDEv27'
  },
  {
    id: 2,
    email: 'sapta2@gmail.com',
    userName: 'Anuska2027'
  },
  {
    id: 3,
    email: 'sapta3@gmail.com',
    userName: 'Anurshi27'
  },
]

const router = Router();

router.get('/users/email', loggingMiddleware, (request, response) => {
  console.log(request.cookies);
  if( request.cookies.hello === undefined && request.cookies.hello !== "world"){
    return response.status(403).json({
      success : false ,
      message : 'Invalid cookie. Your coookie had been expired'
    })
  }
  return response.status(200).json({
    users_list_email: users.map((x) => x.email)
  })
});

router.get('/users', loggingMiddleware, (request, response) => {
  return response.status(200).json({
    users_list: users
  })
})

router.get('/users/query',

  loggingMiddleware,

  query("filter")
    .isString().withMessage('It should be a string only')
    .notEmpty().withMessage('It should not be empty')
    .isLength({ max: 32, min: 3 }).withMessage('The query should be of min 3 letters and max of 32 letter'),

  (request, response) => {
   
    if(request.cookies.hello === undefined && request.cookies.hello != "world"){
      return response.status(403).json({
        success : false,
        message : 'No Cookie found !!'
      })
    }

    console.log(request.query);
    const result = validationResult(request);
    console.log(result)
    const { filter, value } = request.query;
    if (!filter && !value) {
      return response.status(400).json({
        success: false,
        message: 'Query parameters are missing !!'
      })
    }
    if (filter && value) {
      const filteredUsers = users.filter((user) => user[filter] == value);
      if (filteredUsers.length == 0) {
        return response.status(200).json({
          success: true,
          message: 'No such record found from DB'
        })
      }
      return response.status(200).json({
        success: true,
        message: 'Records filtered successfully',
        data: filteredUsers
      })
    }

  })

router.post('/api/users/create',

  loggingMiddleware,

  body("userName").isString().withMessage('UserName should only be a string')
    .isLength({ max: 15, min: 4 }).withMessage("UserName should be atleast of 4 letters and of max 32 letters")
    .notEmpty().withMessage('UserName should not be empty'),

  body("email").isString().withMessage('Email should be a string')
    .isLength({ max: 40, min: 8 }).withMessage('Email should be of valid length')
    .notEmpty().withMessage('Email should not be empty')

  , (request, response) => {
    const result = validationResult(request)
    console.log(result)
    const { userName, email } = request.body;
    if (!userName || !email) {
      return response.status(400).json({
        success: false,
        message: 'UserName or Email Field is missing !!'
      })
    }
    const createUser = {
      id: users.length + 1,
      userName: userName,
      email: email
    }
    const newUser = users.push(createUser);
    if (newUser) {
      return response.status(200).json({
        success: true,
        message: 'New User is created successfully !!',
        newUser: createUser
      })
    }
  });

router.put('/api/users/update/:id',

  loggingMiddleware,

  param("id").isString().withMessage('Update Id should not be a string')
    .isInt({ min: 1 }).withMessage('ID should be a integer >=1')
    .notEmpty().withMessage('Id should be present')

  , (request, response) => {
    const result = validationResult(request)
    console.log(result)
    const { id } = request.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return response.status(400).json({
        success: false,
        message: 'Bad Request from Client Side !!. Pls check the ID sent '
      })
    }
    const findUser = users.findIndex((user) => user.id === parsedId);
    if (findUser == -1) {
      return response.status(404).json({
        success: false,
        message: 'User not Found !! . Pls check the User details correctly'
      })
    }
    const { body } = request;
    users[findUser] = { id: parsedId, ...body };
    return response.status(200).json({
      success: true,
      message: 'Record Updated successfully',
      data: users[findUser]
    })
  })

router.patch('/api/users/update/:id',

  loggingMiddleware,

  param("id").isString().withMessage('Should not be a string')
    .isInt({ min: 1 }).withMessage('Should be a int >=1')
    .notEmpty().withMessage('Id should be present')

  , (request, response) => {
    const result = validationResult(request)
    console.log(result)
    const { id } = request.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return response.status(400).json({
        success: false,
        message: 'Bad Request . Pls check the ID sent !!'
      })
    }
    const findUser = users.findIndex((user) => user.id === parsedId);
    if (findUser == -1) {
      return response.status(404).json({
        success: false,
        messsage: 'User Not Found . Pls provide the correct details !!'
      })
    }
    const body = request.body;
    users[findUser] = { ...users[findUser], ...body }
    return response.status(200).json({
      success: true,
      message: 'Record is updated successfullly !!',
      updatedUser: users[findUser]
    })
  });


router.delete('/api/users/delete/:id',

  loggingMiddleware,

  param("id").isString().withMessage('Should not be a string')
    .isInt({ min: 1 }).withMessage('Should be a int >=1')
    .notEmpty().withMessage('Id should be present'),

  checkingUserID, (request, response) => {
    const result = validationResult(request)
    console.log(result)
    const findUser = request.findUserIndex;
    const deletedUser = users.slice(findUser, findUser + 1);
    if (deletedUser) {
      return response.status(200).json({
        success: true,
        message: 'User is deleted successfully !!',
        deletedUser: deletedUser
      })
    }
    else {
      return response.status(400).json({
        success: false,
        message: 'Failed to delete user'
      })
    }
  });

// PUT Request // 
/* PUT REQUEST => In case of PUT request , we are trying to update a document , it updates all the fields of the documents . If we not provide the new data of the fields , then it removes those fields  */

/*Patch Request : In  case of Patch Request  : We only update the fields that are required to  be updated from the client side */

/*Delete Request : In case of DELETE , the document gets deleted from the side */

/*
'GET' request : 1st parameter : /health => route ;  2nd Parameter : () => {} // callback function  ; (request , response) :
request object => gets the Headers from client side from req.headers , gets the IP addreess , gets the data from client side from req.body
and response is a object that takes the data from the server side ( maybe database) and returns it to client side ( maybe JSON , TEXT , HTML)
*/

export default router;