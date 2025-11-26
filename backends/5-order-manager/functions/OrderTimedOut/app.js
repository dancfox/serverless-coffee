/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb')

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION })
const documentClient = DynamoDBDocumentClient.from(ddbClient)

// Returns details of a Place ID where the app has user-generated content.
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  const params = {
    TableName: process.env.TableName,
    Key: {
      PK: 'orders',
      SK: event.detail.orderId
    },
    UpdateExpression: "set ORDERSTATE = :state, TS = :TS, reason = :reason",
    ExpressionAttributeValues:{
      ":state": event.detail.eventId+'-CANCELLED',
      ":reason": event.detail.cause,
      ":TS": Date.now()
    },
    ReturnValues:"ALL_NEW"
  }

  console.log(params)
  const command = new UpdateCommand(params)
  const result = await documentClient.send(command)
}
