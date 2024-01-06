import multer from 'multer'

export const fileValidation = {
	image: ['image/png', 'image/jpeg', 'image/webp'],
	pdf: ['application/pdf'],
}

function fileUpload(customValidation = []) {
	const storage = multer.diskStorage({})
	function fileFilter(req, file, cb) {
		if (customValidation.includes(file.mimetype)) {
			cb(null, true)
		} else {
			cb('invalid format', false)
		}
	}
	const upload = multer({
		fileFilter,
		storage,
		limits: {
			fileSize: 50 * 1024 * 1024, // 50 MB
		},
	})
	return upload
}

export default fileUpload
