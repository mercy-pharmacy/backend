import connectDB from '../../DB/connection.js'
import productsRouter from './product/product.router.js'
import { globalErrorHandling } from '../services/errorHandling.js'
import categoriesRouter from './category/category.router.js'
import subcategoryRouter from './subcategory/subcategory.router.js'

const initApp = (app, express) => {
	app.use(express.json())
	connectDB()
	app.get('/', (req, res) => {
		res.json('Welcome to Mercy Pharmacy backend.')
	})
	app.use('/categories', categoriesRouter)
	app.use('/subcategory', subcategoryRouter)
	app.use('/products', productsRouter)
	app.get('*', (req, res) => {
		return res.status(404).json({ message: 'page not found ' + req.originalUrl })
	})

	app.use(globalErrorHandling)
}

export default initApp
