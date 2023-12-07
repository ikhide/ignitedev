'use strict'
const fs = require('fs')

module.exports = {
  igniteApp: {
    privateKey: process.env.GITHUB_PRIVATE_KEY?.toString(),
    appId: process.env.GITHUB_APP_ID,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    accessToken: process.env.GITHUB_ACCESS_TOKEN,
    installationId: process.env.GITHUB_INSTALLATION_ID,
    userName: process.env.GITHUB_USERNAME,
  },
}
