const User = require('../models/User')
const File = require('../models/File')
const Yup = require('yup')
const { startOfHour, parseISO, isBefore, format, subHours } = require('date-fns')
const pt = require('date-fns/locale/pt')
const Appointment = require('../models/Appointment')
const Notification = require('../schemas/Notification')

class AppointmentController {
    async index(req, res) {
        try {
            const { page = 1 } = req.query

            const appointments = await Appointment.findAll({
                where: { user_id: req.userId, cancelled_at: null },
                order: ['date'],
                attributes: ['id', 'date'],
                limit: 20,
                offset: (page - 1) * 20,
                include: [
                    {
                        model: User,
                        as: 'provider',
                        attributes: ['id', 'name'],
                        include: [{
                            model: File,
                            as: 'avatar',
                            attributes: ['path', 'url']
                        }]
                    },
                ]
            })
            return res.json(appointments)
        } catch (err) {
            return res.status(400).json({ error: err.message || err })
        }
    }

    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                provider_id: Yup.number().required(),
                date: Yup.date().required()
            })

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'Invalid Body' })
            }

            const { provider_id, date } = req.body

            const isProvider = await User.findOne({ where: { id: provider_id, provider: true } })
            if (!isProvider) {
                return res
                    .status(401)
                    .json({ error: 'Trying to create appointment without a valid provider' })
            }

            if (provider_id == req.userId) {
                return res.status(400).json({ error: 'Cannot schedule appointments to yourself' })
            }
            const hourStart = startOfHour(parseISO(date))

            if (isBefore(hourStart, new Date())) {
                return res.status(400).json({ error: 'Past dates are not permitted' })
            }

            const checkAvailability = await Appointment.findOne({
                where: {
                    provider_id,
                    cancelled_at: null,
                    date: hourStart
                }
            })

            if (checkAvailability) {
                return res.status(400).json({ error: 'Appointment date already taken' })
            }

            const appointment = await Appointment.create({
                user_id: req.userId,
                provider_id,
                date: hourStart
            })

            const user = await User.findByPk(req.userId)
            const formattedDate = format(
                hourStart, "'dia' dd 'de' MMMM', às' H:mm'h'", { locale: pt }
            )

            await Notification.create({
                content: `Novo agendamento de ${user.name} para ${formattedDate}`,
                user: provider_id
            })

            return res.json(appointment)
        } catch (err) {
            return res.status(400).json({ err: err.message || err })
        }
    }

    async delete(req, res) {
        try {
            const appointment = await Appointment.findByPk(req.params.id)
            if (appointment.user_id !== req.userId) {
                return res.status(401).json({
                    error: "You don't have permission to cancel this appointment"
                })
            }
            const dateWithSub = subHours(appointment.date, 2)

            if (isBefore(dateWithSub, new Date())) {
                
            }

        } catch (err) {
            return res.status(400).json({ err: err.message || err })
        }
    }
}

module.exports = new AppointmentController()