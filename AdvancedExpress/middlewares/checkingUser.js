//checkingUSER ID middleware //
const checkingUserID = (request, response, next) => {
  const { id } = request.params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return response.status(400).json({
      success: false,
      message: 'INVALID ID'
    })
  }
  const findUserIndex = users.findIndex((user) => user.id === parsedId)
  if (findUserIndex == -1) {
    return response.status(404).json({
      success: false,
      message: 'User is not found'
    })
  }
  request.findUserIndex = findUserIndex;
  next();
}

export default checkingUserID