/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { IoTClient, DescribeEndpointCommand } = require('@aws-sdk/client-iot')
const iotClient = new IoTClient({ region: process.env.AWS_REGION })

exports.handler = async function (event, context) {
  console.log("REQUEST RECEIVED:\n" + JSON.stringify(event))

  // For Delete requests, immediately send a SUCCESS response.
  if (event.RequestType == "Delete") {
    await sendResponse(event, context, "SUCCESS")
    return
  }

  try {
    const command = new DescribeEndpointCommand({})
    const data = await iotClient.send(command)
    
    const responseData = { IotEndpointAddress: data.endpointAddress }
    console.log("response data: " + JSON.stringify(responseData))
    await sendResponse(event, context, "SUCCESS", responseData)
  } catch (err) {
    const responseData = { Error: "describeEndpoint call failed" }
    console.log(responseData.Error + ":\n", err)
    await sendResponse(event, context, "FAILED", responseData)
  }
}

// Send response to the pre-signed S3 URL
async function sendResponse(event, context, responseStatus, responseData) {
  let responseBody = JSON.stringify({
    Status: responseStatus,
    Reason: `CloudWatch Log Stream: ${context.logStreamName}`,
    PhysicalResourceId: context.logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: responseData,
  })

  console.log("RESPONSE BODY:\n", responseBody)

  const https = require("https")

  const parsedUrl = new URL(event.ResponseURL)
  const options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.pathname + parsedUrl.search,
    method: "PUT",
    headers: {
      "content-type": "",
      "content-length": responseBody.length,
    },
  }

  console.log("SENDING RESPONSE...\n")

  return new Promise((resolve, reject) => {
    const request = https.request(options, function (response) {
      console.log("STATUS: " + response.statusCode)
      console.log("HEADERS: " + JSON.stringify(response.headers))
      resolve()
    })

    request.on("error", function (error) {
      console.log("sendResponse Error:" + error)
      reject(error)
    })

    // write data to request body
    request.write(responseBody)
    request.end()
  })
}
