const mongoose = require('mongoose')


const cattleSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner',
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    weight:{
        type: String,

    },
    identificationNumber:{
        type: String,
        require:true
    },
    healthStatus: {
        type: String,
        enum: ['Healthy', 'Sick', 'Pregnant', 'Injured', 'Other']
    },
    vaccinations:{
        type: String,
    },
    vaccinationDate:{
        type: Date,
        default: null
    },
    reproductionHistory: {
        isPregnant: {
            type: Boolean,
            default: false
        },
        pregnancies: {
            type: Number,
            default: 0
        },
        lastCalvingDate:{
            type: Date,
            default: null
        }
    },

    images: {
        type: String,
        trim: true,
    },
    notes: {
        type:String,
    },
},
{timestamps: true}
)

const Cattle = mongoose.model('Cattle', cattleSchema);

module.exports = Cattle


