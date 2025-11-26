/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb')
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge')

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION })
const documentClient = DynamoDBDocumentClient.from(ddbClient)
const eventbridgeClient = new EventBridgeClient({ region: process.env.AWS_REGION })

// Returns details of a Place ID where the app has user-generated content.
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  const params = {
    TableName: process.env.TableName,
    Key: {
      PK: 'orders',
      SK: event.detail.orderId,
    },
    UpdateExpression: "set TS = :TS, TaskToken = :TaskToken, orderNumber = :orderNumber",
    ConditionExpression: "#userId = :userId",
    ExpressionAttributeNames:{
      "#userId": "USERID"
    },
    ExpressionAttributeValues:{
      ":userId": event.detail.userId,
      ":TaskToken": event.detail.TaskToken,
      ":orderNumber": event.detail.orderNumber,
      ":TS": Date.now()
    },
    ReturnValues: "ALL_NEW"
  }

  console.log(params)
  const command = new UpdateCommand(params)
  const result = await documentClient.send(command)
  console.log(result)

  // Publish event to EventBridge
  const ebParams = {
    Entries: [
      {
        Detail: JSON.stringify({
          orderId: result.Attributes.SK,
          orderNumber: result.Attributes.orderNumber,
          state: result.Attributes.ORDERSTATE,
          drinkOrder: JSON.parse(result.Attributes.drinkOrder),
          userId: result.Attributes.USERID,
          robot: result.Attributes.robot,
          eventId:event.detail.eventId,
          TS: result.Attributes.TS,
          Message:"A Lambda function is invoked which stores the Step Functions Task Token in an Amazon DynamoDB table. The Task Token is later used to resume the workflow when the barista completes or cancels the order."
        }),
        DetailType: 'OrderManager.WaitingCompletion',
        EventBusName: process.env.BusName,
        Source: process.env.Source,
        Time: new Date
      }
    ]
  }

  console.log('publishEvent: ', ebParams)
  const ebCommand = new PutEventsCommand(ebParams)
  const response = await eventbridgeClient.send(ebCommand)
  console.log('EventBridge putEvents:', response)
}
