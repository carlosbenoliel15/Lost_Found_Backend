const cloudinary = require("cloudinary");
const cloudinaryService = {
    async uploadImage(fileName, folderName) {
        return cloudinary.v2.uploader
            .upload('uploads/' + fileName, { folder: folderName })
    },

    async getImage(publicId) {
        return cloudinary.v2.url(publicId)
    }
}

module.exports = cloudinaryService;
