'use strict'
const {app} = require('./server');
const config = require('./config')
app.listen(config.serverSettings.port, () => {
    console.log(`Server listen on port ${config.serverSettings.port}`)
})
