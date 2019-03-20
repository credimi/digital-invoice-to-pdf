import dotenv from 'dotenv'
import express from 'express'
dotenv.config()

// Create a new express application instance
const app: express.Application = express()

app.get('/', (req, res) => {
  res.send(`Hello ${process.env.APP_ID}!`)
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
