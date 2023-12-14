import 'dotenv/config'
import express from 'express'
import connectDB from './DB/connection.js'
import initApp from "./src/modules/app.router.js"

const app = express()
const PORT = process.env.PORT || 4000

initApp(app, express)

app.listen(PORT, (req, res) => {
	console.log('server is running... ' + PORT)
})
