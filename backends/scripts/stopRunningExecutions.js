/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

// Environment variables
process.env.AWS_REGION = '<< ENTER REGION >>'
process.env.StateMachineArn = '<< ENTER ARN >>'

// AWS services
const { SFNClient, ListExecutionsCommand, StopExecutionCommand } = require('@aws-sdk/client-sfn')
const sfnClient = new SFNClient({ region: process.env.AWS_REGION })

// Gets current number of running executions in state machine
const stopRunningExecutions = async (record) => {
  const sfnParams = {
    stateMachineArn: process.env.StateMachineArn,
    maxResults: 1000,
    statusFilter: 'RUNNING'
  }
  const listCommand = new ListExecutionsCommand(sfnParams)
  const sfnResult = await sfnClient.send(listCommand)
  // console.log (JSON.stringify(sfnResult, null, 2))

  Promise.all(sfnResult.executions.map((execution) => {
    console.log('Deleting: ', execution.executionArn)
    const stopCommand = new StopExecutionCommand({ executionArn: execution.executionArn })
    return sfnClient.send(stopCommand)
  }))
}

// Entry point
const main = async () => {
  console.log(await stopRunningExecutions())
}

main().catch(error => console.error(error))
