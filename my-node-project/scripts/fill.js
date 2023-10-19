const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { v4: uuid } = require("uuid");

const items  = require("./../mocks/products.json");

const Products = [],
  Stocks = [];

items.forEach((item) => {
  const id = uuid();

  Products.push({
    id,
    title: item.title,
    description: item.description,
    price: item.price,
  });

  Stocks.push({
    product_id: id,
    count: item.count,
  });
});

const client = new DynamoDB({region: 'us-east-1'});
const ddbDocClient = DynamoDBDocument.from(client);

Products.forEach(async (product) => {
  await ddbDocClient.put({
    TableName: "products",
    Item: product,
  });
});

Stocks.forEach(async (stock) => {
  await ddbDocClient.put({
    TableName: "stocks",
    Item: stock,
  });
});

ddbDocClient.destroy();
client.destroy();

console.log("Tables populated");
