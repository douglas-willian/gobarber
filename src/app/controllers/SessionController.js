const jwt = require('jsonwebtoken')
const Yup = require('yup')

const User = require('../models/User')
const auth = require('../../config/auth')

class SessionController {
    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                email: Yup.string().email(),
                password: Yup.string()
            })
    
            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: "Invalid body" })
            }
    
            const { email, password } = req.body
    
            const user = await User.findOne({ where: { email } })
            if (!user) {
                return res.status(401).json({ error: 'User not found' })
            }
    
            if (!(await user.checkPassword(password))) {
                return res.status(401).json({ error: 'Password does not match' })
            }
    
            const { id, name } = user
    
            return res.json({
                user: {
                    id,
                    name,
                    email
                },
                token: jwt.sign({ id }, auth.secret, {
                    expiresIn: auth.expiresIn
                })
            })
        } catch (err) {
            return res.status(400).json({ error: err.message || err })
        }   
    }
}

module.exports = new SessionController()