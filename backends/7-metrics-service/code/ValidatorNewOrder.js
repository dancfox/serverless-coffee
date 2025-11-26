/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch')
const cloudWatchClient = new CloudWatchClient({ region: process.env.AWS_REGION })

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  const params = {
    MetricData: [
      {
        'MetricName': 'Order',
        'Dimensions': [
          {
            'Name': 'State',
            'Value': 'Started'
          }
        ],
        Timestamp: event.time,
        'Unit': 'Count',
        'Value': 1
      }
    ],
    Namespace: `${process.env.AppName}-dev`
  }
  // Send to CloudWatch
  const command = new PutMetricDataCommand(params)
  console.log(await cloudWatchClient.send(command))
}
