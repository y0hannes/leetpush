const express = require('express')
const axios = require('axios')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())

const CLIENT_ID = process.env.GITHUB_CLIENT_ID
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

app.get('/oauth/callback', async (req, res) => {
  const code = req.query.code

  if (!code) return res.status(400).send('Missing code')

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code
      },
      {
        headers: {
          accept: 'application/json'
        }
      }
    )

    const accessToken = response.data.access_token

    const redirectUrl = `chrome-extension://migfhggpdakiligofkakelemlahcglda/?token=${accessToken}`
    res.redirect(redirectUrl)
  } catch (err) {
    console.error('Error exchanging code for token:', err.message)
    res.status(500).send('OAuth token exchange failed')
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`OAuth server listening on port ${PORT}`)
})
