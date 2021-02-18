const File = require('../models/File')

class FileController {
    async store(req, res) {
        try {
            const { originalname: name, filename: path } = req.file

            const file = await File.create({
                name, path
            })
    
            return res.json(file)
        } catch (err) {
            return res.status(400).json({ error: err.message || err })
        }
    }
}
module.exports = new FileController()