exports.run = function( data, next ) {

	data.imgpath = 'img/uploads/';
	data.imgdir = __dirname + '/../public/' + data.imgpath;
	
	data.twig = require( 'twig' );
	if ( data.config.debug )
		data.twig.cache( false );

	if ( !data.config.debug ) {
		var Minify = require( 'express-minify-html' );
		data.app.use( Minify( {
			override: true,
			exception_url: false,
			htmlMinifier: {
				removeComments: true,
				collapseWhitespace: true,
				collapseBooleanAttributes: true,
				removeAttributeQuotes: true,
				removeEmptyAttributes: true,
				minifyJS: true
		    }
		}));
	}
	
	data.app.use( data.express.static( __dirname + '/../public' ) );
	
	data.fs.readdir( './assets/js', (err, js) => {
		data.fs.readdir( './assets/css', (err, css) => {
			
			var create_assets = function() {
				var assets = {
					'app.js' : {
						type: 'js',
						dir: 'js',
						main: 'app.js',
						files: [ '*.js' ],
					},
					'app.css' : {
						type: 'css',
						dir: 'css',
						main: 'style.css',
						files: [ '*.css' ],
					},
				};
					
				var config = {
					rootRoute : '/',
					srcDir : __dirname + '/../assets',
					buildDir : './public',
					process : 'false',
					env: 'production'
				};
					
				data.app.use( require( 'express-asset-manager' )( assets, config ) );

			};
			
			if ( data.config.create_assets )
				create_assets();
			
			if ( data.config.debug ) {
				data.app.use( data.express.static( __dirname + '/../assets' ) );
				data.js = js;
				data.css = css;
			}
			else {
				data.js = [ 'app.js' ];
				data.css = [ 'app.css' ];
			}
			
			data.update_images = function( next ) {
				data.sql.query( 'SELECT * FROM `images`', function( err, results ) {
					if ( err )
						console.log( err );
					else {
						data.images = {};
						results.forEach( result => {
							data.images[ result.id ] = result.filename;
						});
						next();
					}
				})
			}
			
			data.twig.extendFunction( 'img', ( req, imgid, cls, width, height ) => {

				var img;
				if ( data.images[ imgid ] )
					img = '<img src="' + data.imgpath + data.images[ imgid ] + '" alt="' + data.images[ imgid ] + '" width="' + width /*+ '" height="' + height*/ + '"/>';
				else
					img = '<div class="img" style="width:' + width + 'px;height:' + height + 'px;"></div>';
				
				if ( req.is_admin ) {
					var dt = {
						imgid: imgid,
						cls: cls,
						width: width,
						height: height,
					};
					img = '<div data-img="' + data.makeeditable( dt ) + '">' + img + '</div>';
				}

				return img;
			});
			next();
			
		});
	});
		
}
