const mongoose = require('mongoose')


const guestSchema = new mongoose.Schema({
    visited:{
        type:Boolean,
        require:true
    },
    visitDate:{
        type:Date,
        
    }
},
{timestamps: true})
const Guest = mongoose.model('Guest', guestSchema)

module.exports = Guest