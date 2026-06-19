const imageKit=require("@imagekit/nodejs");
require("dotenv").config();
const ImageKitClient=new imageKit({

    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,

})

async function uploadFile(file){
    const uploadPayload = {
        file: Buffer.isBuffer(file) ? file.toString("base64") : file,
        fileName: "images_" + Date.now(),
        folder: "Hotels_images/images"
    };

    const result = await ImageKitClient.files.upload(uploadPayload);
    return result;
}

module.exports={uploadFile};