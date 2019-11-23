// @flow
import AWS from 'aws-sdk';
import C from '../constants';
import uuid from 'uuid/v1';
import apiService from './api-service';

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: C.AWS_ACCESS_KEY_ID,
      secretAccessKey: C.AWS_SECRET_ACCESS_KEY
});
const bucketName = C.AWS_BUCKET_NAME;

class ImageService {
  get uploadsDir() {
    return 'uploads'
  }
  upload(files: [File], postId: number): Promise<string> {
    return apiService.upload(`/posts/${postId}/images`, files, 'images[]')
  }

  download(filename: string): Promise<Buffer> {
    console.log('filename: ', filename);
    return new Promise((resolve, reject) => {
      const Key = `${this.uploadsDir}/${filename}`;
      console.log('key: ', Key);
      const params = {
        Bucket: bucketName,
        Key
      };
      console.log('params: ', params);
      return s3.getObject(params, (err, data) => {
        if (data) {
          /* var arrayBufferView = new Uint8Array(data.Body);
          var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
          var urlCreator = window.URL || window.webkitURL;
          var imageUrl = urlCreator.createObjectURL( blob );
          return resolve(imageUrl);
        */
          return resolve(data.Body);
        }
        if (err) {
          console.log(err);
        }
        return reject(err);
      });
    });
  }
}

export default new ImageService();
