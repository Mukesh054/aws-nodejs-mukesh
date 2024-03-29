const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { v4: uuid } = require("uuid");

function isPostValid(post) {
  if (!post) {
    return false;
  }

  const { title, description, price, count } = JSON.parse(post);

  return (
    typeof title === "string" &&
    title.length > 0 &&
    typeof description === "string" &&
    description.length > 0 &&
    typeof price === "number" &&
    price % 1 === 0 &&
    price > 0 &&
    typeof count === "number" &&
    count % 1 === 0 &&
    count > 0
  );
}

module.exports.default = async function (event) {
  const { productsTable, stocksTable } = process.env;
  const client = new DynamoDB({});
  const docClient = DynamoDBDocument.from(client);

  if (!isPostValid(event.body)) {
    return {
      statusCode: 400,
      body: {
        message: JSON.stringify("The data in invalid"),
      },
    };
  }

  const { title, description, price, count } = JSON.parse(event.body);
  const id = uuid();

  try {
    const result = await docClient.transactWrite({
      TransactItems: [
        {
          Put: {
            Item: {
              id,
              title,
              description,
              price,
            },
            TableName: productsTable,
          },
        },
        {
          Put: {
            Item: {
              product_id: id,
              count,
            },
            TableName: stocksTable,
          },
        },
      ],
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        id,
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: {
        message: JSON.stringify("Internal error with wrtiting to DB"),
      },
    };
  }
};
