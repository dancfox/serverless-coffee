/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch')
const cloudWatchClient = new CloudWatchClient({ region: process.env.AWS_REGION })

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  const params = {
    MetricData: [
    ],
    Namespace: `${process.env.AppName}-dev`
  }

  // Add drink info
  params.MetricData.push({
    'MetricName': 'Drink',
    'Dimensions': [
      {
        'Name': 'Drink',
        'Value': event.detail.drinkOrder.drink
      }
    ],
    'Unit': 'Count',
    'Value': 1
  })

  // Add modifiers
  event.detail.drinkOrder.modifiers.map((modifier) => {
    params.MetricData.push({
      'MetricName': 'Drink',
      'Dimensions': [
        {
          'Name': 'Modifier',
          'Value': modifier
        }
      ],
      'Unit': 'Count',
      'Value': 1
    })
  })

  // console.log(JSON.stringify(params, null, 2))

  // Send to CloudWatch
  const command = new PutMetricDataCommand(params)
  console.log(await cloudWatchClient.send(command))
}
