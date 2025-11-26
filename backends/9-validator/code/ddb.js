/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb')

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION })
const documentClient = DynamoDBDocumentClient.from(ddbClient)


const getConfig = async (id) => {
  const PKvalue = `config-${id}`
  const params = {
    TableName: process.env.ConfigTableName,
    KeyConditionExpression: "#pk = :pk",
    ExpressionAttributeNames: {
      "#pk": "PK"
    },
    ExpressionAttributeValues: {
      ":pk": PKvalue
    }
  }
  console.log('getConfig params: ', params)

  try {
    const command = new QueryCommand(params)
    const result = await documentClient.send(command)
    console.log('getConfig result: ', result.Items)
    return result.Items
  } catch (err) {
    console.error('getConfig error: ', err)
  }
}

const getItem = async (id) => {
  const params = {
    TableName: process.env.TableName,
    KeyConditionExpression: "#pk = :pk",
    ExpressionAttributeNames: {
      "#pk": "PK"
    },
    ExpressionAttributeValues: {
      ":pk": id
    }
  }
  console.log('getItem params: ', params)

  try {
    const command = new QueryCommand(params)
    const result = await documentClient.send(command)
    console.log('getItem result: ', result)
    return result
  } catch (err) {
    console.error('getItem error: ', err)
  }
}

const saveItem = async (record) => {
  const Item = {
    PK: record.PK,
    ...record
  }
  console.log(Item)
  const command = new PutCommand({
    TableName: process.env.TableName,
    Item
  })
  const result = await documentClient.send(command)
  console.log('saveItem: ', result)
}

const decrementToken = async (record) => {
  const params = {
    TableName: process.env.TableName,
    Key: {
      PK: record.PK
    },
    UpdateExpression: "set availableTokens = availableTokens - :val",
    ExpressionAttributeValues:{
      ":val": 1
    },
    ReturnValues:"UPDATED_NEW"
  }
  console.log(params)
  const command = new UpdateCommand(params)
  const result = await documentClient.send(command)
  console.log('decrementToken: ', result)
}

module.exports = { getConfig, saveItem, getItem, decrementToken }