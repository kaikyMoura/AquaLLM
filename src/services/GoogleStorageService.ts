import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import Multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

class GoogleStorageService {

    private credentials = String(process.env.GOOGLE_APLICATION_CREDENTIALS)

    private storage = new Storage({ keyFilename: process.env.GOOGLE_APLICATION_CREDENTIALS });

    async uploadFileToGCS(buffer: Buffer) {
        let bucketName = "aqua_llm"
        this.storage.authClient._getApplicationCredentialsFromFilePath(this.credentials)

        const fileName = uuidv4() + "_image.jpeg"

        const bucket = this.storage.bucket(bucketName).file(fileName)

        const options: GetSignedUrlConfig = {
            version: 'v4',
            action: "read",
            expires: Date.now() + 15 * 60 * 1000,
        };

        const [url] = await bucket.getSignedUrl(options);

        await bucket.save(buffer, {
            contentType: 'image/jpeg',
            metadata: {
                cacheControl: 'public, max-age=31536000',
            },
        })

        return {
            image_url: `https://storage.googleapis.com/${bucketName}/${fileName}`,
            temp_url: url

        }
    }

}

export default new GoogleStorageService()