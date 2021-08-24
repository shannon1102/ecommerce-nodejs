// check if field exist in req.body
const checkRequiredFieldInBody = (requiredFields) => (req, res, next) => {
    const missingFields = requiredFields.filter(requiredField => {
        if (!req.body.hasOwnProperty(requiredField)) {
            return requiredField
        }
    })
    if (missingFields.length > 0) {
        return res.status(500).json({message: `${missingFields.toString()} are required!!`})
    }
    next()
}

const checkRequiredFieldInQuery = (requiredFields) => (req, res, next) => {
    const missingFields = requiredFields.filter(requiredField => {
        if (!req.query.hasOwnProperty(requiredField)) {
            return requiredField
        }
    })
    if (missingFields.length > 0) {
        return res.status(500).json({message: `${missingFields.toString()} are required!!`})
    }
    next()
}

module.exports = Object.assign({}, {checkRequiredFieldInBody, checkRequiredFieldInQuery})