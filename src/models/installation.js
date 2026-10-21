const mongoose =  require('mongoose');

const installationSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'singleton',
      unique: true,    
      immutable: true,  
    },
    installed: { type: Boolean, default: false },
    installedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Installation', installationSchema);