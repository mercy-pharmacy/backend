import 'dotenv/config'
import express from 'express'
import connectDB from './DB/connection.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
connectDB()

app.listen(PORT, (req, res) => {
	console.log('server is running... ' + PORT)
})
