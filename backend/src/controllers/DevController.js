const axios = require('axios');
const Dev = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        response.json(devs);
    },


    async store(request, response) {
        try {

            const { github_username, techs, latitude, longitude } = request.body.data;

            let dev = await Dev.findOne({ github_username });

            if (!dev) {
                const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);


                var { name, login, avatar_url, bio } = apiResponse.data;
                if (!name) {
                    name = login
                }
                const techsArray = parseStringAsArray(techs);

                const location = {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                };

                dev = await Dev.create({
                    github_username,
                    name,
                    avatar_url,
                    bio,
                    techs: techsArray,
                    location
                });

                const sendSocketMessageTo = findConnections(
                    { latitude, longitude },
                    techsArray
                );
                
                sendMessage(sendSocketMessageTo, 'new-dev',dev);

                return response.json(dev);
            }
            return response.json({ error: "Já cadastrado" });

        } catch (error) {
            console.log("error")
            console.log(error)
            return response.json({ error: error })
        }

    },



    async update(request, response) {

        const {
            github_username,
            name,
            bio,
            avatar_url,
            techs,
            latitude,
            longitude
        } = request.body;


        const techsArray = await parseStringAsArray(techs);
        const dev = await Dev.findOne({ github_username });

        let newDev = { $set: dev };

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };

        if (name) {
            newDev.name = name;
        }
        if (bio) {
            newDev.bio = bio;
        }
        if (latitude && longitude) {
            newDev.location = location;
        }

        if (techs) {
            if (techsArray !== dev.techs) {
                newDev.techs = techsArray;
            }
        }
        if (avatar_url) {
            newDev.avatar_url = avatar_url;
        }

        const responseUpdate = await Dev.updateOne(dev, newDev);

        return response.json(responseUpdate);

    },

    async destroy(request, response) {

        const { github_username } = request.query;

        let dev = await Dev.findOne({ github_username });

        dev = await Dev.deleteOne(dev);

        return response.json(dev);
    }
};