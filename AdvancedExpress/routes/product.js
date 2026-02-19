import { Router } from 'express'
import { body, param, query, validationResult } from 'express-validator'

import loggingMiddleware from '../middlewares/logging.js'
import checkingUserID from '../middlewares/checkingUser.js'



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

const router = Router();

router.get('/products', (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies)
  if (request.cookies.hello && request.cookies.hello === "world") {
    return response.status(200).json({
      products_list: products
    })
  }
  else{
    return response.status(403).json({
      success : false ,
      message : 'Invalid Cookie Sent . Or ur cookies have been expired !!'
    })
  }
});


router.get('/products/:id',
  param("id")
    .notEmpty().withMessage('ID cannot be non empty !!')
    .isInt({ min: 1 }).withMessage("Must be an interger >= 1")

  , (request, response) => {

     console.log(request.cookies)
     if( request.cookies.hello === undefined && request.cookies.hello !== "world"){
      return response.status(403).json({
        success : false ,
        message : 'Invalid Cookie. Pls provide valid Cookie !!'
      })
     }
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
  });

export default router;