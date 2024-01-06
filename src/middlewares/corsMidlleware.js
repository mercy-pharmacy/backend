import { request, response } from 'express'

export const corsMiddleware = ({
	origin = '*',
	methods = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE',
	credentials = true,
	maxAge = 7200,
} = {}) => {
	return (req = request, res = response, next) => {
		res.setHeader('Access-Control-Allow-Origin', origin)
		res.setHeader('Access-Control-Allow-Methods', methods)
		res.setHeader(
			'Access-Control-Allow-Headers',
			'admin-token, Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
		)
		res.setHeader('Access-Control-Allow-Credentials', credentials)
		res.setHeader('Access-Control-Allow-Private-Network', true)
		res.setHeader('Access-Control-Max-Age', maxAge)
		next()
	}
}
