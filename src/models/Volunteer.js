const mongoose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

const VolunteerSchema = new mongoose.Schema({
    name: String,
    instagram_username: String,
    help_desc: String,
    profile_pic_url_hd: String,
    allowed_day: String,
    contact: String,
    location: {
        type: PointSchema,
        index: '2dsphere'
    }
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);