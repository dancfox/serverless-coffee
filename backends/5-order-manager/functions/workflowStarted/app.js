/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb')

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION })
const documentClient = DynamoDBDocumentClient.from(ddbClient)

// Returns details of a Place ID where the app has user-generated content.
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))
  
    const params ={
    TableName: process.env.TableName,
    Item: {
      PK: 'orders',
      SK: event.detail.orderId,
      USERID: event.detail.userId,
      ORDERSTATE: event.detail.eventId+'-CREATED',
      TaskToken: event.detail.TaskToken,
      robot: (event.detail.robot || false),
      TS: Date.now()
    }
  }

  console.log(params)
  const command = new PutCommand(params)
  const result = await documentClient.send(command)
}
