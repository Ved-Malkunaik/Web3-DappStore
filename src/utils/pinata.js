import axios from 'axios';

const key = import.meta.env.VITE_PINATA_API_KEY;
const secret = import.meta.env.VITE_PINATA_SECRET_API_KEY;

export const uploadFileToIPFS = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
            project: 'DAppStore'
        }
    });
    data.append('pinataMetadata', metadata);

    console.log("Starting Pinata upload for:", file.name);
    try {
        const response = await axios.post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'pinata_api_key': key,
                'pinata_secret_api_key': secret
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                if (window.onIPFSUploadProgress) {
                    window.onIPFSUploadProgress(percentCompleted);
                }
            }
        });
        console.log("Pinata Upload Successful! CID:", response.data.IpfsHash);
        return response.data.IpfsHash;
    } catch (error) {
        console.error("Pinata Upload Error Details:", error.response?.data || error.message);
        throw error;
    }
};
