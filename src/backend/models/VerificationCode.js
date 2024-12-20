import mongoose from "mongoose";

const VerificationCodeSchema = new mongoose.Schema({
  email: String,
  code: String,
  generatedAt: Date,
  expiredAt: Date
});

const VerificationCode = mongoose.model('VerificationCode', VerificationCodeSchema);
export default VerificationCode;