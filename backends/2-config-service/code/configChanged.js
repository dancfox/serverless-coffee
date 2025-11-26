/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge')
const eventbridgeClient = new EventBridgeClient({ region: process.env.AWS_REGION })

// Returns application config
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 0))
  const NewImage = event.Records[0].dynamodb.NewImage

  // Publish to EventBridge with change info
  const params = {
    Entries: [
      {
        Detail: JSON.stringify({ NewImage }),
        DetailType: 'ConfigService.ConfigChanged',
        EventBusName: process.env.EventBusName,
        Source: process.env.Source,
        Time: new Date()
      }
    ]
  }

  console.log('Event: ', JSON.stringify(params, null, 0))
  const command = new PutEventsCommand(params)
  const response = await eventbridgeClient.send(command)
  console.log('EventBridge putEvents:', response)
}
