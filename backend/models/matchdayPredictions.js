import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const matchDayPredictionsSchema = new mongoose.Schema({
  user: {
    type: String,  // Reference to the User model
    ref: 'User',     // Reference to the user collection
    required: true,
  },
  matchweek: {
    type: Number,
    required: true,
  },
  predictions: [
    {
      matchId: {
        type: Number,  // Assuming this references a match document
        required: true,
      },
      homeTeamScore: {
        type: Number,
        required: true,
      },
      awayTeamScore: {
        type: Number,
        required: true,
      },
    }
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true }); // Automatically creates 'createdAt' and 'updatedAt' fields

const MatchDayPredictions = mongoose.model("MatchDayPredictions", matchDayPredictionsSchema);

export default MatchDayPredictions;
