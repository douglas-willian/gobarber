const User = require('../models/User')
const File = require('../models/File')

class ProviderController {
    async index(req, res) {
        try {
            const provider = await User.findAll({
                where: { provider: true },
                attributes: ['id', 'name', 'email', 'avatar_id'],
                include: [{
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path', 'url']
                }]
            })
            return res.json(provider)
        } catch (err) {
            return res.status(400).json({ error: err.message || err })
        }   
    }
}

module.exports = new ProviderController()