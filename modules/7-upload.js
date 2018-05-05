exports.run = function( data, next ) {

	var Formidable = require( 'formidable' );
	var Path = require( 'path' );
	var ReadChunk = require( 'read-chunk' );
	var FileType = require( 'file-type' );
	
	/**
	 * Upload photos route.
	 */
	data.app.post('/upload_photos', function (req, res) {
	    var photos = [],
	        form = new Formidable.IncomingForm();

	    // Tells formidable that there will be multiple files sent.
	    form.multiples = true;
	    // Upload directory for the images
	    form.uploadDir = Path.join(__dirname, '../tmp_uploads');

	    // Invoked when a file has finished uploading.
	    form.on('file', function (name, file) {
	        // Allow only 3 files to be uploaded.
	        if (photos.length === 3) {
	            data.fs.unlink(file.path);
	            return true;
	        }

	        var buffer = null,
	            type = null,
	            filename = '';

	        // Read a chunk of the file.
	        buffer = ReadChunk.sync(file.path, 0, 262);
	        // Get the file type using the buffer read using read-chunk
	        type = FileType(buffer);

	        // Check the file type, must be either png,jpg or jpeg
	        if (type !== null && (type.ext === 'png' || type.ext === 'jpg' || type.ext === 'jpeg')) {
	            // Assign new file name
	            filename = Date.now() + '-' + file.name;

	            // Move the file with the new file name
	            data.fs.rename(file.path, Path.join(__dirname, '../public/img/uploads/' + filename));

	            // Add to the list of photos
	            photos.push({
	                status: true,
	                filename: filename,
	                type: type.ext,
	                publicPath: 'img/uploads/' + filename
	            });
	        } else {
	            photos.push({
	                status: false,
	                filename: file.name,
	                message: 'Invalid file type'
	            });
	            data.fs.unlink(file.path);
	        }
	    });

	    form.on('error', function(err) {
	        console.log('Error occurred during processing - ' + err);
	    });

	    // Invoked when all the fields have been processed.
	    form.on('end', function() {
	        console.log('All the request fields have been processed.');
	    });

	    // Parse the incoming form fields.
	    form.parse(req, function (err, fields, files) {
	        res.status(200).json(photos);
	    });
	});
	
	
	data.twig.extendFunction( 'img', ( req, imgid, cls, width, height ) => {
		return 'asd';
	});
	
	return next();
}
