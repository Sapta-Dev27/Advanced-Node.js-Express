import { request } from 'express';
import express from 'express';
import { query, body, validationResult, param } from 'express-validator'
import userRoutes from './routes/user.js'
import productRoutes from './routes/product.js'
import cookieParser from 'cookie-parser';

const PORT = 8001
const app = express(); // invoke the app
 
app.use(express.json())
app.use(cookieParser())
app.use(userRoutes);
app.use(productRoutes);

//health check route
app.get('/health', (request, response) => {
  response.send('SERVER IS LIVE')
})

app.get('/' , (request , response) => {
  response.cookie("hello" , "world" ,{ maxAge : 60000})
  return response.send('WELCOME TO THE SERVER . It is LIVE')
})


app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON ${PORT}`)  // listen the app , return a callback function to start the server
})


