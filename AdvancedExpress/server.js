import e, { request } from 'express';
import express from 'express';
const PORT = 8001
const app = express(); // invoke the app 


app.use(express.json())

//health check route
app.get('/health', (request, response) => {
  response.send('SERVER IS LIVE')
})

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

//products array
const products = [
  {
    id: 1,
    name: 'Iphone 15'
  },
  {
    id: 2,
    name: 'Iphone 16'
  },
  {
    id: 3,
    name: 'Iphone 17'
  },
]

//get : /users/email  => route
app.get('/users/email', (request, response) => {
  return response.status(200).json({
    users_list_email: users.map((x) => x.email)
  })
})

// get : /users => route
app.get('/users', (request, response) => {
  return response.status(200).json({
    users_list: users
  })
})

// get : /products => route 
app.get('/products', (request, response) => {
  return response.status(200).json({
    products_list: products
  })
})

// get : /products/:id => route
app.get('/products/:id', (request, response) => {
  const parsedId = parseInt(request.params.id);
  if (isNaN(parsedId)) {
    return response.status(400).json({
      success: false,
      message: 'Bad Request . Pls send some proper ID !!'
    })
  }
  const fetchedProduct = products.find((x) => x.id === parsedId);
  if (!fetchedProduct) {
    return response.status(404).json({
      success: false,
      message: 'Product is not found in the LIST !!'
    })
  }
  return response.status(200).json({
    success: true,
    message: 'Fetched Product successfully',
    product_fetched_from_db: fetchedProduct
  })
})


//Query Parameters //
app.get('/users/query', (request, response) => {
  console.log(request.query);
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


// POST Request //
app.post('/api/users/create', (request, response) => {
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
})

// PUT Request // 
/* PUT REQUEST => In case of PUT request , we are trying to update a document , it updates all the fields of the documents . If we not provide the new data of the fields , then it removes those fields  */

app.put('/api/users/update/:id', (request, response) => {
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

/*Patch Request : In  case of Patch Request  : We only update the fields that are required to  be updated from the client side */

app.patch('/api/users/update/:id', (request, response) => {
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
  users[findUser] = {...users[findUser] , ...body}
  return response.status(200).json({
    success : true ,
    message : 'Record is updated successfullly !!' ,
    updatedUser : users[findUser]
  })
})

/*
'GET' request : 1st parameter : /health => route ;  2nd Parameter : () => {} // callback function  ; (request , response) :
request object => gets the Headers from client side from req.headers , gets the IP addreess , gets the data from client side from req.body
and response is a object that takes the data from the server side ( maybe database) and returns it to client side ( maybe JSON , TEXT , HTML)
*/


app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON ${PORT}`)  // listen the app , return a callback function to start the server
})


