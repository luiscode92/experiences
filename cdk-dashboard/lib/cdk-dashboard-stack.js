const cdk = require('@aws-cdk/core');
const { UserPool, VerificationEmailStyle, UserPoolClient, AccountRecovery } = require('@aws-cdk/aws-cognito');
const { GraphqlApi, AuthorizationType, FieldLogLevel, MappingTemplate, Schema, UserPoolDefaultAction } = require('@aws-cdk/aws-appsync');
const { AttributeType, BillingMode, Table } = require('@aws-cdk/aws-dynamodb');
const { Role, ServicePrincipal, Effect, PolicyStatement } = require('@aws-cdk/aws-iam');

class CdkDashboardStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    // Amazon cognito authentication
    const userPool = new UserPool(this, 'dashboard-app-user-pool', {
      selfSignUpEnabled: true,
      accountRecovery: AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        }
      }
    });
    const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
      userPool
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId
    });
    // DynamoDB tables and GSIs (Global Secondary Indexes)
    const messageTable = new Table(this, 'CDKMessageTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
    });
    
    const roomTable = new Table(this, 'CDKRoomTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
    });

    const scoreTable = new Table(this, 'CDKScoreTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
    });
    
    messageTable.addGlobalSecondaryIndex({
      indexName: 'messages-by-room-id',
      partitionKey: {
        name: 'roomId',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING
      }
    })

    scoreTable.addGlobalSecondaryIndex({
      indexName: 'scores-by-room-id',
      partitionKey: {
        name: 'roomId',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING
      }
    })

    const messageTableServiceRole = new Role(this, 'MessageTableServiceRole', {
      assumedBy: new ServicePrincipal('dynamodb.amazonaws.com')
    });
    
    messageTableServiceRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [`${messageTable.tableArn}/index/messages-by-room-id`],
        actions: [            
          'dymamodb:Query'
        ]
      })
    );

    const scoreTableServiceRole = new Role(this, 'scoreTableServiceRole', {
      assumedBy: new ServicePrincipal('dynamodb.amazonaws.com')
    });
    
    scoreTableServiceRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [`${scoreTable.tableArn}/index/scores-by-room-id`],
        actions: [            
          'dymamodb:Query'
        ]
      })
    );

    const api = new GraphqlApi(this, 'cdk-dashboard-app-api', {
      name: "cdk-dashboard-app",
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      schema: Schema.fromAsset('./graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: userPool,
            defaultAction: UserPoolDefaultAction.ALLOW
          }
        },
      },
    });
    
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
    });
    
    const messageTableDs = api.addDynamoDbDataSource('Message', messageTable);
    const roomTableDs = api.addDynamoDbDataSource('Room', roomTable);
    const scoreTableDs = api.addDynamoDbDataSource('Score', scoreTable);
    
    messageTableDs.createResolver({
      typeName: 'Query',
      fieldName: 'listMessagesForRoom',
      requestMappingTemplate: MappingTemplate.fromString(`
      {
        "version" : "2017-02-28",
        "operation" : "Query",
        "index" : "messages-by-room-id",
        "query" : {
          "expression": "roomId = :roomId",
          "expressionValues" : {
            ":roomId" : $util.dynamodb.toDynamoDBJson($context.arguments.roomId)
          }
    
        }
        #if( !$util.isNull($ctx.arguments.sortDirection)
              && $ctx.arguments.sortDirection == "DESC" )
          ,"scanIndexForward": false
        #else
          ,"scanIndexForward": true
        #end
        #if($context.arguments.nextToken)
          ,"nextToken": "$context.arguments.nextToken"
        #end
    }
      `),
      responseMappingTemplate: MappingTemplate.fromString(`
        #if( $ctx.error )
          $util.error($ctx.error.message, $ctx.error.type)
        #else
          $util.toJson($ctx.result)
        #end`
      )
    })
    
    messageTableDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'createMessage',
      requestMappingTemplate: MappingTemplate.fromString(`
      ## Automatically set the id if it's not passed in.
      $util.qr($context.args.input.put("id", $util.defaultIfNull($ctx.args.input.id, $util.autoId())))
      ## Automatically set the createdAt timestamp.
      #set( $createdAt = $util.time.nowISO8601() )
      $util.qr($context.args.input.put("createdAt", $util.defaultIfNull($ctx.args.input.createdAt, $createdAt)))
    
      ## Automatically set the user's username on owner field.
      $util.qr($ctx.args.input.put("owner", $context.identity.username))
    
      ## Create a condition that will error if the id already exists
      #set( $condition = {
        "expression": "attribute_not_exists(#id)",
        "expressionNames": {
            "#id": "id"
        }
      } )
    
      {
        "version": "2018-05-29",
        "operation": "PutItem",
        "key": {
          "id":   $util.dynamodb.toDynamoDBJson($ctx.args.input.id)
        },
        "attributeValues": $util.dynamodb.toMapValuesJson($context.args.input),
        "condition": $util.toJson($condition)
      }
      `),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem()
    })
    
    roomTableDs.createResolver({
      typeName: 'Query',
      fieldName: 'listRooms',
      requestMappingTemplate: MappingTemplate.fromString(`
        #set( $limit = $util.defaultIfNull($context.args.limit, 1000) )
        #set( $ListRequest = {
          "version": "2018-05-29",
          "limit": $limit
        } )
        #if( $context.args.nextToken )
          #set( $ListRequest.nextToken = $context.args.nextToken )
        #end
        $util.qr($ListRequest.put("operation", "Scan"))
        $util.toJson($ListRequest)
      `),
      responseMappingTemplate: MappingTemplate.fromString(`
        #if( $ctx.error)
          $util.error($ctx.error.message, $ctx.error.type)
        #else
          $util.toJson($ctx.result)
        #end
      `)
    })
    
    roomTableDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'createRoom',
      requestMappingTemplate: MappingTemplate.fromString(`
      $util.qr($context.args.input.put("id", $util.defaultIfNull($ctx.args.input.id, $util.autoId())))
      {
        "version": "2018-05-29",
        "operation": "PutItem",
        "key": {
          "id":   $util.dynamodb.toDynamoDBJson($ctx.args.input.id)
        },
        "attributeValues": $util.dynamodb.toMapValuesJson($context.args.input),
        "condition": $util.toJson($condition)
      }
      `),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem() 
    })
    // score stuff
    scoreTableDs.createResolver({
      typeName: 'Query',
      fieldName: 'listScoresForRoom',
      requestMappingTemplate: MappingTemplate.fromString(`
      {
        "version" : "2017-02-28",
        "operation" : "Query",
        "index" : "scores-by-room-id",
        "query" : {
          "expression": "roomId = :roomId",
          "expressionValues" : {
            ":roomId" : $util.dynamodb.toDynamoDBJson($context.arguments.roomId)
          }
    
        }
        #if( !$util.isNull($ctx.arguments.sortDirection)
              && $ctx.arguments.sortDirection == "DESC" )
          ,"scanIndexForward": false
        #else
          ,"scanIndexForward": true
        #end
        #if($context.arguments.nextToken)
          ,"nextToken": "$context.arguments.nextToken"
        #end
    }
      `),
      responseMappingTemplate: MappingTemplate.fromString(`
        #if( $ctx.error )
          $util.error($ctx.error.message, $ctx.error.type)
        #else
          $util.toJson($ctx.result)
        #end`
      )
    })
    
    scoreTableDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'createScore',
      requestMappingTemplate: MappingTemplate.fromString(`
      ## Automatically set the id if it's not passed in.
      $util.qr($context.args.input.put("id", $util.defaultIfNull($ctx.args.input.id, $util.autoId())))
      ## Automatically set the createdAt timestamp.
      #set( $createdAt = $util.time.nowISO8601() )
      $util.qr($context.args.input.put("createdAt", $util.defaultIfNull($ctx.args.input.createdAt, $createdAt)))
    
      ## Automatically set the user's username on owner field.
      $util.qr($ctx.args.input.put("owner", $context.identity.username))
    
      ## Create a condition that will error if the id already exists
      #set( $condition = {
        "expression": "attribute_not_exists(#id)",
        "expressionNames": {
            "#id": "id"
        }
      } )
    
      {
        "version": "2018-05-29",
        "operation": "PutItem",
        "key": {
          "id":   $util.dynamodb.toDynamoDBJson($ctx.args.input.id)
        },
        "attributeValues": $util.dynamodb.toMapValuesJson($context.args.input),
        "condition": $util.toJson($condition)
      }
      `),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem()
    })
  }
}

module.exports = { CdkDashboardStack }
