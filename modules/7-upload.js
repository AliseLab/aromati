exports.run = function( data, next ) {

	var Formidable = require( 'formidable' );
	var Path = require( 'path' );
	var ReadChunk = require( 'read-chunk' );
	var FileType = require( 'file-type' );
	
	/**
	 * Upload photos route.
	 */
	data.app.post('/upload_photos', function (req, res) {
		if ( req.is_admin ) {
		    var photos = [],
		        form = new Formidable.IncomingForm();
	
		    // Tells formidable that there will be multiple files sent.
		    form.multiples = true;
		    // Upload directory for the images
		    form.uploadDir = Path.join(__dirname, '../tmp_uploads');
	
		    var imgfile = null;
		    var imgid = null;
		    
		    var process = function() {
		    	
		    	if ( imgfile && imgid ) {
		    	
			        // Allow only 1 file to be uploaded.
			        if (photos.length === 1) {
			            data.fs.unlink(imgfile.path);
			            return true;
			        }
		
			        var buffer = null,
			            type = null,
			            filename = '';
		
			        // Read a chunk of the file.
			        buffer = ReadChunk.sync(imgfile.path, 0, 262);
			        // Get the file type using the buffer read using read-chunk
			        type = FileType(buffer);
		
			        var done = function() {
			        	res.status(200).json(photos);
			        }
			        
			        var error = null;
			        
			        if ( type === null || (type.ext !== 'png' && type.ext !== 'jpg' && type.ext !== 'jpeg') )
			        	error = 'Invalid file type';
			        else if ( !imgid )
			        	error = 'Missing image id';
			        
			        if ( !error ) {

			        	data.sql.query( 'SELECT `filename` FROM `images` WHERE `id` = ?', [ imgid ], function( err, results ) {
			        		if ( err )
			        			console.log( err );
			        		else {
				        		var filename = Date.now() + '-' + imgid + '.' + type.ext;
				        		var sql;
				        		if ( results.length > 0 ) {
				        			try {
				        				data.fs.unlinkSync( data.imgdir + results[0].filename );
				        			} catch ( e ) {
				        				
				        			}
				        			sql = 'UPDATE `images` SET `filename` = ? WHERE `id` = ?';
				        		}
				        		else {
				        			sql = 'INSERT INTO `images` ( `filename`, `id` ) VALUES ( ?, ? )';
				        		}
				        		
				        		data.sql.query( sql, [ filename, imgid ], function( err, results ) {

				        			if ( err )
				        				console.log( err );
				        			else {
							            // Move the file with the new file name
				        				
							            data.fs.rename(imgfile.path, data.imgdir + filename, function() {
						
								            // Add to the list of photos
								            photos.push({
								                status: true,
								                imgid: imgid,
								                filename: filename,
								                type: type.ext,
								                publicPath: 'img/uploads/' + filename
								            });
								            
								            done();
							            });
				        			}
				        		});
			        		}
			        	});

			        } else {
			            photos.push({
			                status: false,
			                filename: imgfile.name,
			                message: error
			            });
			            data.fs.unlink(imgfile.path);
			            done();
			        }
		    	}
		    }
		    
		    form.on( 'field', function( key, value ) {
		    	if ( key == 'imgid' ) {
		    		imgid = value;
	    			process();
		    	}
		    });
		    
		    // Invoked when a file has finished uploading.
		    form.on('file', function (name, file) {
		    	imgfile = file;
		    	process();
		    });
	
		    form.on('error', function(err) {
		        //console.log('Error occurred during processing - ' + err);
		    });
	
		    // Invoked when all the fields have been processed.
		    form.on('end', function() {
		        //console.log('All the request fields have been processed.');
		    });
	
		    // Parse the incoming form fields.
		    form.parse(req, function (err, fields, files) {
		        //res.status(200).json(photos);
		    });
		}
		else
			res.status( 403 ).send( '' );
	});
	
	
	return next();
}
