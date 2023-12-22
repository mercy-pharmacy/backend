import cors from 'cors'
import connectDB from '../../DB/connection.js'
import { globalErrorHandling } from '../services/errorHandling.js'
import categoriesRouter from './category/category.router.js'
import productsRouter from './product/product.router.js'
import subcategoryRouter from './subcategory/subcategory.router.js'

const initApp = (app, express) => {
	app.use(cors({ origin: process.env.CLIENT_DOMAIN }))
	app.use(express.json())
	connectDB()
	app.get('/', (req, res) => {
		res.json('Welcome to Mercy Pharmacy backend.')
	})
	app.use('/categories', categoriesRouter)
	app.use('/subcategory', subcategoryRouter)
	app.use('/products', productsRouter)
	// app.get('/sentemail', async (req, res, next) => {
	//     const html = `
	//         <p>
	//             helllllllllllllllllllllo
	//         </p>
	//     `
	//     await sendMail("m.w.jarrad@gmail.com", "test nodemailer", html)
	//     res.status(200).json({message: "email sent successfully"})
	// })
	app.get('*', (req, res) => {
		return res.status(404).json({ message: 'page not found ' + req.originalUrl })
	})

	app.use(globalErrorHandling)
}

export default initApp
