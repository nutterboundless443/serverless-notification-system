const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.sendNotification = async (event) => {
    const body = JSON.parse(event.body);
    const { userId, message, channel } = body;

    // Save notification to DynamoDB
    const params = {
        TableName: 'Notifications',
        Item: {
            id: userId,
            message,
            channel,
            timestamp: new Date().toISOString()
        }
    };
    await dynamoDB.put(params).promise();

    // Send notification
    const messageParams = {
        Message: message,
        TopicArn: `arn:aws:sns:us-east-1:${process.env.AWS_ACCOUNT_ID}:${channel}`
    };
    await sns.publish(messageParams).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Notification sent!' })
    };
};