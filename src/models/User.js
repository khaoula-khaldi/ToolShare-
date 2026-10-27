const mongoose =  require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, required: true },
        email: {type: String,trim: true,lowercase: true,required: true,unique: true},
        password: {type: String ,  required: true,select: false,},
        role: {type: String,enum: ['admin' , 'user','gestionnaire'],default: 'user',},
        magasinId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Magasin",
            default: null
        },
        status : {type : Boolean , default : true}
    },{ timestamps: true,toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        }, }
);

module.exports =  mongoose.model('User', userSchema);