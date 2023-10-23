import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const BUCKET_NAME = "myshop-aws-task-5-container";

export default async function (event) {
  const query = event.queryStringParameters;
  const fileName = query.name;

  const client = new S3Client({ region: "us-east-1" });
  try {
    const signed = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `uploaded/${fileName}`,
      }),
      { expiresIn: 3600 }
      );
      
      return {
        statusCode: 200,
        headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Content-Type": "text/plain",
      },
      body: signed,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to get s3 object",
      }),
    };
  }
}
