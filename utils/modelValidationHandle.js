const validationHandle = (errors) =>
  Object.keys(errors).reduce((acc, cur) => {
    return (acc = [...acc, errors[cur].message])
  }, [])

module.exports = validationHandle
