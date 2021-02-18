const Notification = require('../schemas/Notification')
const User = require('../models/User')

class NotificationController {
    async index(req, res) {
        try {
            const isProvider = await User.findOne({ where: { id: req.userId, provider: true } })
            if (!isProvider) {
                return res
                    .status(401)
                    .json({ error: 'User not a valid provider' })
            }
            const notifications = await Notification.find({
                user: req.userId
            })
                .sort({ createdAt: 'desc' })
                .limit(20)

            return res.json(notifications)
        } catch (err) {
            return res.status(400).json({ err: err.message || err })
        }
    }
    async update(req, res) {
        try {
            const notification = await Notification.findByIdAndUpdate(req.params.id,
                { read: true },
                { new: true }
            )
            return res.json(notification)
    } catch(err) {
        return res.status(400).json({ err: err.message || err })
    }
}
}

module.exports = new NotificationController()