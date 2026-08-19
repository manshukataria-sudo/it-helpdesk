const { containerClient } = require("../config/azureBlob");
const crypto = require("crypto");

const uploadToBlob = async (file) => {
  const fileExtension = file.originalname.includes(".")
    ? file.originalname.substring(file.originalname.lastIndexOf("."))
    : "";

  const blobName = `${crypto.randomUUID()}${fileExtension}`;

  const blockBlobClient =
    containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: {
      blobContentType: file.mimetype,
    },
  });

  return {
    blobName,
    fileName: file.originalname,
    contentType: file.mimetype,
    size: file.size,
  };
};

module.exports = {
  uploadToBlob,
};