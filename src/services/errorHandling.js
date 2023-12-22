export const asyncHandler = fn => {
	return (req, res, next) => {
		fn(req, res, next).catch(err => {
			return next(err)
		})
	}
}

export const globalErrorHandling = (err, req, res, next) => {
	// handle unique errors
	if (err.code == 11000) {
		const key = Object.keys(err.keyValue)[0]
		const value = err.keyValue[key]
		const message = `${key.charAt(0).toUpperCase() + key.slice(1)} '${value}' already exist.`
		return res.status(409).json({ message })
	}
	// Global Errors
	return res.status(err.cause || 500).json({ message: err?.message || err })
}
