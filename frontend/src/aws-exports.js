const awsConfig = {
    Auth: {
        Cognito: {
            userPoolId: "us-east-1_xxxxxxxxx",
            userPoolClientId: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
            loginWith: {
                email: true,
            }
        }
    },
    Storage: {
        S3: {
            bucket: "homebrewz-bucket",
            region: "us-east-1",
        }
    }
};

export default awsConfig;
