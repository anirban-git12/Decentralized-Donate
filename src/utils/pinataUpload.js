import axios from 'axios';

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY;

export const uploadToPinata = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();
  data.append('file', file);

  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      exampleKey: 'exampleValue'
    }
  });
  data.append('pinataMetadata', metadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 1
  });
  data.append('pinataOptions', pinataOptions);

  try {
    const response = await axios.post(url, data, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw error;
  }
};
