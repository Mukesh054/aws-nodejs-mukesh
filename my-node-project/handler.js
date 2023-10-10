const products = require("./products.json");

const defaultHeaders = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*'
};

module.exports.getProductById = async (event, _context) => {
  const { productId } = event.pathParameters;
  try {
    return {
      statusCode: 200,
      headers: {
        ...defaultHeaders
    },
      body: JSON.stringify(products.find((product) => product.id === productId)),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        ...defaultHeaders
    },
      body: JSON.stringify({ message: "Error in single product services...." }),
    };
  }
};

module.exports.getAllProducts = async (event, _context) => {
  try {
    return {
      statusCode: 200,
      headers: {
        ...defaultHeaders
    },
      body: JSON.stringify(products),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        ...defaultHeaders
    },
      body: JSON.stringify({ message: "Error in all products services...." }),
    };
  }
};
