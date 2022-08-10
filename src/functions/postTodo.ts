import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 } from 'uuid';

import { document } from '../utils/dynamodbClient';

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  await document
    .put({
      TableName: 'todos',
      Item: {
        id: v4(),
        user_id: userid,
        title,
        done: false,
        deadline: new Date(deadline).toISOString(),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Todo criado com sucesso!',
    }),
  };
};