# Serverlesspresso-Node14-to-Node22

## Objective

Upgrade the Serverlesspresso serverless coffee ordering application from Node.js 14.x to Node.js 22.x runtime, migrate AWS SDK v2 to v3, modernize Lambda function configurations, and ensure all SAM templates and application code are compatible with Node.js 22 while maintaining full functionality of the event-driven architecture including EventBridge, Cognito authentication, DynamoDB, IoT Core, and Step Functions integrations.

## Summary

This transformation systematically upgrades all Lambda functions in the Serverlesspresso application from the deprecated Node.js 14.x runtime to Node.js 22.x. The process includes updating all SAM template.yaml files to specify nodejs22.x runtime, migrating AWS SDK v2 code to v3 (since Node.js 18+ Lambda environments include SDK v3 by default), updating package.json dependencies for Node.js 22 compatibility, modernizing deprecated Node.js API usage patterns, and validating that all AWS service integrations (EventBridge, Cognito triggers, DynamoDB, IoT Core, Step Functions) continue to function correctly after the upgrade. The transformation preserves application behavior while gaining Node.js 22 performance improvements and modern JavaScript features.

## Entry Criteria

1. The application must be a serverless application using AWS SAM (Serverless Application Model) with template.yaml files
2. Lambda functions must currently be using nodejs14.x runtime in their SAM template configurations
3. The codebase must contain Lambda function code using AWS SDK v2 (require('aws-sdk') pattern)
4. The application must use EventBridge for event-driven messaging between services
5. The application must include Cognito custom authentication flow with Lambda triggers
6. The application must integrate with AWS IoT Core for real-time messaging
7. The application must contain package.json files with dependencies that may need Node.js 22 compatibility updates
8. The application structure must include core infrastructure directories (00-baseCore, 01-appCore) and microservices in backends/ directory

## Implementation Steps

1. **Update SAM Template Runtime Configurations**
   - Locate all template.yaml files in the project (00-baseCore/, 01-appCore/, backends/*/template.yaml)
   - Find all Lambda function resource definitions using AWS::Serverless::Function type
   - Change Runtime property from "nodejs14.x" to "nodejs22.x" for every Lambda function
   - Verify SAM Transform version remains "AWS::Serverless-2016-10-31" (current and valid version)
   - Preserve all existing Lambda function configurations including MemorySize, Timeout, Policies, Environment variables
   - Ensure AWS_NODEJS_CONNECTION_REUSE_ENABLED environment variable is maintained (still valid in Node.js 22)
   - Validate YAML syntax remains correct after runtime changes

2. **Migrate AWS SDK v2 to AWS SDK v3**
   - Locate all JavaScript files (.js) containing "const AWS = require('aws-sdk')" or "const aws = require('aws-sdk')"
   - Replace AWS SDK v2 service client instantiation with v3 modular imports:
     * Replace "new AWS.IotData()" with "@aws-sdk/client-iot-data" IoTDataPlaneClient
     * Replace "new AWS.EventBridge()" with "@aws-sdk/client-eventbridge" EventBridgeClient
     * Replace "new AWS.DynamoDB.DocumentClient()" with "@aws-sdk/lib-dynamodb" DynamoDBDocumentClient
     * Replace "new AWS.Iot()" with "@aws-sdk/client-iot" IoTClient
     * Replace "new AWS.StepFunctions()" with "@aws-sdk/client-sfn" SFNClient
   - Convert AWS SDK v2 promise-based calls (e.g., "iotdata.publish(params).promise()") to v3 command pattern (e.g., "await client.send(new PublishCommand(params))")
   - Remove "AWS.config.update({region: process.env.AWS_REGION})" calls (v3 automatically uses AWS_REGION environment variable)
   - Update parameter structures where v3 differs from v2 (most parameters remain compatible)
   - Remove aws-sdk from devDependencies in package.json files (SDK v3 is included in Node.js 18+ Lambda runtime)

3. **Update Package.json Dependencies**
   - Locate all package.json files throughout the project
   - Remove or update "aws-sdk": "^2.x" from dependencies and devDependencies (not needed in Node.js 18+ Lambda)
   - Update Node.js engine specification to "node": ">=22.0.0" if engines field exists
   - Update nanoid package to latest version compatible with Node.js 22 (if used)
   - Update any other npm dependencies to versions that support Node.js 22
   - Verify no dependencies have explicit Node.js version constraints that exclude Node.js 22
   - Add AWS SDK v3 client packages only if code needs to be tested locally outside Lambda environment

4. **Modernize Deprecated Node.js API Usage**
   - Search for deprecated Buffer() constructor usage and replace with Buffer.from(), Buffer.alloc(), or Buffer.allocUnsafe()
   - Check crypto module usage for deprecated methods (particularly crypto.createCipher and crypto.createDecipher)
   - Update any url.parse() usage to use new URL() constructor or url.URL class
   - Replace callback-style CloudFormation custom resource responses with promise-based patterns where applicable
   - Update any domain module usage (deprecated and removed in Node.js 16+)
   - Ensure all async operations use async/await pattern consistently instead of mixing callbacks and promises
   - Update any deprecated process.binding() calls if present

5. **Update Cognito Custom Authentication Lambda Triggers**
   - Review Lambda triggers in 00-baseCore/cognito-triggers/ directory (define-auth-challenge.js, create-auth-challenge.js, verify-auth-challenge-response.js, pre-sign-up.js)
   - Update runtime references in SAM template from nodejs14.x to nodejs22.x
   - Verify Cognito event object structure handling remains compatible (event.request, event.response)
   - Ensure synchronous return pattern for Cognito triggers continues to work in Node.js 22
   - Test custom challenge flow logic with Node.js 22 async handling
   - Preserve all Lambda permission configurations (DefineAuthChallengeInvocationPermission, etc.)

6. **Validate EventBridge Integration**
   - Review EventBridge putEvents calls in Lambda functions for SDK v3 migration
   - Ensure event patterns in SAM templates remain unchanged and compatible
   - Verify EventBusName, Source, DetailType, and Detail structure in putEvents calls
   - Confirm EventBridge event routing continues to work with updated Lambda functions
   - Test that EventBridge Rules trigger the correct Lambda functions after runtime upgrade
   - Validate CloudWatch Logs integration for EventBridge events remains functional

7. **Update IoT Core Real-time Messaging**
   - Migrate IoT Data Plane operations from SDK v2 to v3 (iotdata.publish() to IoTDataPlaneClient with PublishCommand)
   - Update IoT endpoint retrieval in GetIoTEndpoint.js custom resource Lambda
   - Migrate iot.describeEndpoint() to v3 pattern using IoTClient and DescribeEndpointCommand
   - Verify IoT topic publishing continues to work with correct endpoint configuration
   - Ensure Cognito Identity Pool permissions for IoT remain valid
   - Test real-time message delivery to IoT Core topics after upgrade

8. **Verify DynamoDB Operations**
   - Migrate DynamoDB DocumentClient operations from SDK v2 to v3
   - Update getItem, putItem, updateItem, query, scan operations to use DynamoDBDocumentClient with v3 commands
   - Ensure DynamoDB table names from environment variables continue to work
   - Verify conditional updates and transactional operations remain functional
   - Test DynamoDB Stream triggers if used in the application
   - Validate error handling for DynamoDB operations with v3 error structures

9. **Update Step Functions Integration**
   - Migrate Step Functions API calls from SDK v2 to v3 (StepFunctions client to SFNClient)
   - Update startExecution, stopExecution, and describeExecution calls to v3 command pattern
   - Verify state machine invocations continue to work correctly
   - Ensure Lambda functions called by Step Functions handle Node.js 22 runtime properly
   - Test workflow orchestration end-to-end after runtime upgrade
   - Validate Step Functions error handling and retry logic

10. **Validate SAM Template Syntax and Build**
    - Run "sam validate" on all updated template.yaml files to check for syntax errors
    - Execute "sam build" to compile the application with Node.js 22 runtime
    - Verify all Lambda functions build successfully without dependency errors
    - Check for any SAM build warnings related to Node.js 22 or dependencies
    - Ensure Lambda deployment package sizes remain within limits
    - Validate that CloudFormation nested stack references remain correct

11. **Update Local Testing and Development**
    - Update any local testing scripts to use Node.js 22
    - Ensure local SAM CLI testing uses correct runtime (sam local invoke with --runtime nodejs22.x)
    - Update Docker images for local Lambda testing to Node.js 22 base
    - Verify environment variable configurations for local testing
    - Update any integration test scripts to handle Node.js 22 specific behaviors
    - Ensure localTest.js files in code directories work with Node.js 22

12. **Handle API Gateway Integration**
    - Verify Lambda proxy integration response format remains compatible with Node.js 22
    - Ensure CORS headers in Lambda responses continue to work correctly
    - Test API Gateway request/response transformations with upgraded Lambda functions
    - Validate query string parameter handling in Node.js 22
    - Check that API Gateway authorizers work correctly with Cognito integration
    - Verify error responses and status codes remain consistent

## Validation / Exit Criteria

1. All template.yaml files specify "Runtime: nodejs22.x" for every Lambda function with no nodejs14.x references remaining
2. All JavaScript files successfully use AWS SDK v3 client libraries with modular imports and command pattern
3. No "require('aws-sdk')" or "const AWS = require('aws-sdk')" statements remain in the codebase
4. All package.json files have removed aws-sdk v2 dependencies and include only Node.js 22 compatible packages
5. SAM validate command succeeds on all template.yaml files without errors or warnings
6. SAM build command completes successfully for all Lambda functions using Node.js 22 runtime
7. All Cognito custom authentication Lambda triggers successfully authenticate users with the custom challenge flow
8. EventBridge events are successfully published and routed to correct Lambda functions
9. IoT Core messages are published successfully to correct topics and received by subscribed clients
10. DynamoDB read and write operations complete successfully with SDK v3 clients
11. Step Functions workflows start and complete successfully with all orchestrated Lambda functions
12. API Gateway endpoints respond correctly with proper CORS headers and status codes
13. No deprecated Node.js API warnings appear in CloudWatch Logs after deployment
14. Application performance metrics show expected improvements from Node.js 22 optimizations
15. End-to-end testing of the coffee ordering workflow completes successfully from order placement through completion
