# Upgrade Node.js 14 to Node.js 24.x for AWS Serverless Applications

## Objective
Upgrade AWS serverless applications from Node.js 14 to Node.js 24.x to leverage improved performance, enhanced security features, modern JavaScript capabilities, and continued AWS support for the latest LTS runtime.

## Summary
This transformation upgrades Node.js 14 applications to Node.js 24.x by updating runtime configurations in AWS SAM templates and package.json files, migrating deprecated Node.js APIs to their modern equivalents, updating AWS SDK usage patterns for Node.js 24.x compatibility, ensuring all npm dependencies support Node.js 24.x, and updating any Node.js 14-specific code patterns to align with Node.js 24.x best practices. The transformation handles Lambda functions, build configurations, and any Node.js-specific features that have changed between versions 14 and 24.

## Entry Criteria
1. Application is currently running on Node.js 14 runtime
2. Application uses AWS Lambda functions with Node.js 14 runtime specified
3. Application has package.json files with Node.js 14 engine specifications or no engine specification
4. Application uses AWS SAM templates with nodejs14.x runtime configured
5. Application code is available for analysis and modification

## Implementation Steps

1. **Update AWS SAM template runtime specifications**
   - Locate all template.yaml or template.yml files in the project
   - Find all Lambda function definitions with Runtime property set to nodejs14.x
   - Update Runtime property from nodejs14.x to nodejs24.x
   - Update any Globals sections that specify nodejs14.x runtime
   - Verify all function resource definitions include the updated runtime

2. **Update package.json engine specifications**
   - Locate all package.json files throughout the project
   - Add or update the engines field to specify Node.js 24.x minimum version: "engines": {"node": ">=24.0.0"}
   - Remove any deprecated package.json fields that are no longer supported in Node.js 24.x
   - Update the npm version requirement if specified to a version compatible with Node.js 24.x

3. **Update deprecated Node.js APIs and patterns**
   - Replace any usage of deprecated crypto APIs (crypto.DEFAULT_ENCODING) with explicit encoding specifications
   - Update any URL parsing code using legacy url.parse() to use the WHATWG URL API (new URL())
   - Replace deprecated Buffer constructor calls (new Buffer()) with Buffer.from(), Buffer.alloc(), or Buffer.allocUnsafe()
   - Update any usage of deprecated process.binding() to use public APIs
   - Replace deprecated punycode module usage with alternatives or userland implementations
   - Update any deprecated domain module usage to use AsyncLocalStorage or other error handling patterns

4. **Update AWS SDK v3 usage patterns for Node.js 24.x**
   - Verify all AWS SDK v3 client imports use the modular import pattern
   - Ensure all AWS SDK client instantiations are compatible with Node.js 24.x
   - Update any AWS SDK middleware or customization code to use Node.js 24.x compatible patterns
   - Verify error handling patterns work correctly with Node.js 24.x Promise implementations
   - Update any HTTP client configurations to be compatible with Node.js 24.x networking changes

5. **Audit and update npm dependencies**
   - Run npm outdated to identify packages that need updates for Node.js 24.x compatibility
   - Update all direct dependencies to versions that support Node.js 24.x
   - Update devDependencies including testing frameworks and build tools to Node.js 24.x compatible versions
   - Resolve any peer dependency conflicts introduced by the Node.js version upgrade
   - Update package-lock.json by running npm install after dependency updates

6. **Update async/await and Promise handling patterns**
   - Verify all async functions properly handle errors with try-catch blocks or Promise rejection handlers
   - Update any callback-based code to use Promise-based patterns or async/await for better compatibility
   - Ensure all Promise chains include proper error handling
   - Update any usage of deprecated Promise patterns to modern equivalents

7. **Update ES modules and CommonJS patterns**
   - If using ES modules (type: "module" in package.json), verify all import/export statements are correct
   - Update any dynamic imports to use the proper syntax for Node.js 24.x
   - Ensure require() calls for JSON files include the appropriate assertions if using ES modules
   - Verify that package.json exports field is properly configured if providing a library

8. **Update build and deployment scripts**
   - Update any package.json scripts that reference Node.js version-specific behaviors
   - Update CI/CD pipeline configurations to use Node.js 24.x in build and test environments
   - Update any Docker configurations that specify Node.js base images to use node:24 or node:24-alpine
   - Update any nvm, nodenv, or other version manager configuration files to reference Node.js 24.x

9. **Update environment-specific configurations**
   - Update any Lambda environment variables that depend on Node.js version-specific features
   - Verify any Lambda layers are compatible with Node.js 24.x runtime
   - Update any custom runtime configurations or extensions for Node.js 24.x compatibility
   - Review and update any memory or timeout configurations that may need adjustment for Node.js 24.x performance characteristics

10. **Update testing configurations and test code**
    - Update test runner configurations (Jest, Mocha, etc.) to versions compatible with Node.js 24.x
    - Update any test code that uses Node.js version-specific APIs
    - Verify mock implementations are compatible with Node.js 24.x
    - Update any test environment setup code for Node.js 24.x compatibility

## Validation / Exit Criteria

1. All SAM template files specify nodejs24.x as the runtime for Lambda functions
2. All package.json files specify Node.js 24.x or higher in the engines field
3. Application builds successfully using Node.js 24.x runtime locally
4. All unit tests pass when executed with Node.js 24.x
5. All integration tests pass when executed with Node.js 24.x
6. No deprecated Node.js APIs are used in the codebase (verified by linting or static analysis)
7. All npm dependencies successfully install without compatibility warnings on Node.js 24.x
8. Lambda functions deploy successfully with nodejs24.x runtime to AWS
9. Application functions correctly in a test environment using Node.js 24.x runtime
10. Performance metrics show equal or improved performance compared to Node.js 14 baseline
11. All AWS SDK v3 client operations function correctly with Node.js 24.x
12. No Node.js deprecation warnings appear in application logs during runtime
