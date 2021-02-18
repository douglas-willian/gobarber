const { startOfDay, endOfDay, parseISO } = require('date-fns')
const { Op } = require('sequelize')

const Appointment = require('../models/Appointment')
const User = require('../models/User')

class ScheduleController {
    async index(req, res) {
        try {
            const checkUserProvider = await User.findOne({
                where: { id: req.userId, provider: true }
            })

            if (!checkUserProvider) {
                return res.status(401).json({ error: 'User is not a provider' })
            }

            const { date } = req.query
            const parsedDate = parseISO(date)

            const appointments = await Appointment.findAll({
                where: {
                    provider_id: req.userId,
                    cancelled_at: null,
                    date: {
                        [Op.between]: [
                            startOfDay(parsedDate),
                            endOfDay(parsedDate)
                        ]
                    }
                }
            })

            return res.json(appointments)
        } catch (err) {
            return res.status(400).json({ err: err.message || err })
        }
    }
}
module.exports = new ScheduleController()