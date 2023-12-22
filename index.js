import dotenv from 'dotenv'
import express from 'express'
import initApp from './src/modules/app.router.js'
dotenv.config({
	path: process.env.NODE_ENV == 'production' ? '.env.production' : '.env.development',
})

const app = express()
const PORT = process.env.PORT || 4000

initApp(app, express)

app.listen(PORT, (req, res) => {
	console.log('server is running... ' + PORT)
})
