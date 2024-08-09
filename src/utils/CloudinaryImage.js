const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const { ApiError } = require("./ApiError");

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDAPISECRET,
});

const CloudinaryImage = async (file) => {
  try {
    if (!file) return null;
    const response = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    fs.unlinkSync(file);
    return response;
  } catch (error) {
    fs.unlinkSync(file);
    throw new ApiError(error.message, 400);
  }
};

module.exports = { CloudinaryImage };
