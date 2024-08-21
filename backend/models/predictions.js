import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
});

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    teams: {
      type: [teamSchema], // Array of team objects
      required: true,
    },
  },
  { timestamps: true }
);

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;
