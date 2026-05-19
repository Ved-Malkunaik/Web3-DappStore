/**
 * Returns the full IPFS gateway URL for a given CID hash.
 * @param {string} hash - The IPFS CID hash
 * @returns {string} - The full URL to access the file via Pinata Gateway
 */
export const getIPFSUrl = (hash) => {
    if (!hash) return '';
    
    // Remove "ipfs://" prefix if it exists and trim whitespace
    const cleanHash = hash.replace('ipfs://', '').trim();
    
    // Pinata public gateway (better for files pinned on Pinata)
    return `https://gateway.pinata.cloud/ipfs/${cleanHash}`;
};
