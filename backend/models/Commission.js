import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    registrationFee: {
      type: Number,
      default: 500,
    },
    pincodeAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    pincodeCommission: {
      type: Number,
      default: 150,
    },
    divisionalAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    divisionalCommission: {
      type: Number,
      default: 50,
    },
    districtAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    districtCommission: {
      type: Number,
      default: 50,
    },
    stateAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    stateCommission: {
      type: Number,
      default: 50,
    },
    companyCommission: {
      type: Number,
      default: 200,
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Commission = mongoose.model('Commission', commissionSchema);
export default Commission;
