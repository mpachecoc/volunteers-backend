
const Volunteer = require('../models/Volunteer');

module.exports = {
    async  index(request, response) {
        // Search Volunteers inside 5 Km.
        // Search according to "allowed day"

        const { latitude, longitude, allowed_day } = request.query;

        const volunteers = await Volunteer.find({
            allowed_day: allowed_day,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 5000,
                },
            },
        });

        return response.json({ volunteers });
    }
}