import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'todo-api-serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: {
    getTodos: {
      handler: 'src/functions/getTodos.handler',
      events: [
        {
          http: {
            path: 'todos/{userid}',
            method: 'get',
            cors: true,
            request: {
              parameters: {
                paths: {
                  userid: true
                }
              }
            }
          },
        },
      ],
    },
    postTodo: {
      handler: 'src/functions/postTodo.handler',
      events: [
        {
          http: {
            path: 'todos/{userid}',
            method: 'post',
            cors: true,
            request: {
              parameters: {
                paths: {
                  userid: true
                }
              }
            }
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['dev', 'local'],
      start: {
        docker: true,
        port: 8000,
        inMemory: true,
        migrate: true,
        seed: true,
        convertEmptyValues: true
      },
    },
  },
  resources: {
    Resources: {
      dbTodos: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: "todos",
          KeySchema: [
            {
              KeyType: "HASH",
              AttributeName: "id"
            }
          ],
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            },
            {
              AttributeName: "user_id",
              AttributeType: "S"
            },
            {
              AttributeName: "deadline",
              AttributeType: "S"
            }
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: "userIdIndex",
              Projection: {
                ProjectionType: "ALL"
              },
              KeySchema: [
                {
                  AttributeName: "user_id",
                  KeyType: "HASH"
                },
                {
                  AttributeName: "deadline",
                  KeyType: "RANGE"
                }
              ],
              ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
              }
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
          }
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
