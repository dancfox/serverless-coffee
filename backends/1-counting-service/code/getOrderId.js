/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb')

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION })
const documentClient = DynamoDBDocumentClient.from(ddbClient)

// Increments the order ID count in the DynamoDB table
const incrementCount = async (record) => {
  const params = {
    TableName: process.env.TableName,
    Key: {
      PK: 'orderID'
    },
    UpdateExpression: "set IDvalue = IDvalue + :val",
    ExpressionAttributeValues:{
      ":val": 1
    },
    ReturnValues:"UPDATED_NEW"
  }
  const command = new UpdateCommand(params)
  const result = await documentClient.send(command)
  console.log('incrementCount: ', result.Attributes.IDvalue)
  return result.Attributes.IDvalue
}

// Returns details of a Place ID where the app has user-generated content.
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))
  const orderNumber = await incrementCount ()
  return { orderNumber  }
}
