/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb')

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION })
const documentClient = DynamoDBDocumentClient.from(ddbClient)

// Reset order ID counter
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  const command = new UpdateCommand({
    TableName: process.env.TableName,
    Key: {
      PK: 'orderID'
    },
    UpdateExpression: "set IDvalue = :val",
    ExpressionAttributeValues:{
      ":val": 0
    }
  })
  await documentClient.send(command)
}
