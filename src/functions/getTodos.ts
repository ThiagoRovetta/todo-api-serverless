
import { APIGatewayProxyHandler } from 'aws-lambda';

import { document } from '../utils/dynamodbClient';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  const response = await document
    .query({
      TableName: "todos",
      IndexName: "userIdIndex",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": userid
      },

    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Get Todos!',
      todos: response.Items
    }),
  };
};
