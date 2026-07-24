import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['State Agent', 'District Agent', 'Divisional Agent', 'Pincode Agent'],
      required: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    division: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    metrics: {
      targetShops: { type: Number, default: 100 },
      completedShops: { type: Number, default: 0 },
    },
    walletBalance: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const Agent = mongoose.model('Agent', agentSchema);
export default Agent;
