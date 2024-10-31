import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { DeleteOptions } from '@google-cloud/storage/build/cjs/src/nodejs-common/service-object';
import { v4 as uuidv4 } from 'uuid';

class GoogleStorageService {

    private storage = new Storage({ keyFilename: process.env.GOOGLE_APLICATION_CREDENTIALS });

    async uploadFileToGCS(buffer: Buffer) {
        let bucketName = "aqua_llm"

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

    async deleteFile(fileUrl: string) {
        try {
            let bucketName = "aqua_llm"

            let fileName = new URL(fileUrl).pathname.split('/').slice(2).join('/')

            const bucket = this.storage.bucket(bucketName).file(fileName)

            await bucket.delete()

            return true
        }
        catch (e) {
            return false
        }
    }
}

export default new GoogleStorageService()