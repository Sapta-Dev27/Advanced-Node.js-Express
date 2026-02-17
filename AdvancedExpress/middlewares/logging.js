//logging middleware //
const loggingMiddleware = (request, response, next) => {
  const time = new Date();
  const req_method = request.method;
  const req_URL = request.url;
  console.log(`Request is coming from URL => ${req_URL} via METHOD => ${req_method} at TIME : ${time.toISOString()}`);
  next();
}


export default loggingMiddleware;