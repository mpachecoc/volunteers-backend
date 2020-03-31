const axios = require ('axios');
const Volunteer = require('../models/Volunteer');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {

    async index (request, response) { 
        const volunteers = await Volunteer.find().limit(10).sort({ _id: 'desc' });

        return response.json(volunteers);
    },

    async store (request, response) { 
        const { instagram_username, help_desc, allowed_day, contact, latitude, longitude } = request.body;
        let { name } = request.body;
        let volunteer = [];

        // Check if Instagram username
        if(instagram_username) {

            // Check if Volunteer already registered
            volunteer = await Volunteer.findOne({ instagram_username });

            if (!volunteer){
                const apiResponse = await axios.get(`https://www.instagram.com/${instagram_username}/?__a=1`);

                // Get Instagram Name & Profile Pic
                name = apiResponse.data.graphql.user.full_name;
                const { profile_pic_url_hd } = apiResponse.data.graphql.user;
            
                // Build Location object with Lat. Lon.
                const location = {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                };
            
                // Create in MongoDB
                volunteer = await Volunteer.create({
                    name,
                    instagram_username,
                    profile_pic_url_hd,
                    help_desc,
                    allowed_day,
                    contact,
                    location,
                });

                // Filter all new connections (websocket), around 5 Km. and if "allowed day" matched
                const sendSocketMessageTo = findConnections(
                    { latitude, longitude },
                    allowed_day,
                )

                sendMessage(sendSocketMessageTo, 'new-volunteer', volunteer);

            }

        }else {
            
            // Build Location object with Lat. Lon.
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            // Create in MongoDB
            volunteer = await Volunteer.create({
                name,
                instagram_username,
                profile_pic_url_hd: 'http://www.maupc.com/img/user.png',
                help_desc,
                allowed_day,
                contact,
                location,
            });

            // Filter all new connections (websocket), around 5 Km. and if "allowed day" matched
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                allowed_day,
            )

            sendMessage(sendSocketMessageTo, 'new-volunteer', volunteer);

        }
    
        return response.json(volunteer);
    }
};