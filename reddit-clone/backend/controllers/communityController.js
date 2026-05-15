const Community = require("../models/Community");

const createCommunity = async (req, res) => {

    try {

        const { name, description } = req.body;

        const communityExists = await Community.findOne({
            name
        });

        if(communityExists){
            return res.status(400).json({
                message: "Community already exists"
            });
        }

        const community = await Community.create({
            name,
            description,
            creator: req.user.id
        });

        res.status(201).json(community);

    } catch(error){

        res.status(500).json({
            message: error.message
        });

    }

};

const getCommunities = async (req, res) => {

    try {

        const communities = await Community.find()
        .populate("creator", "username");

        res.status(200).json(communities);

    } catch(error){

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    createCommunity,
    getCommunities
};