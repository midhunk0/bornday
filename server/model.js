const mongoose=require("mongoose");

const borndaySchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    image: {
        imageName: String,
        imageType: String,
        image: Buffer,
    },
});

const userSchema=new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    borndays: [borndaySchema]
});

const User=mongoose.model("User", userSchema);

module.exports={ User };