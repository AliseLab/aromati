exports.run = function( data, next ) {

	var sectiondir = './modules/sections';
	data.fs.readdir( sectiondir, function( err, files ) {
		if ( err ) {
			console.log( err );
			return;
		}
		
		var render_func = function( req, res ) {
			
			data.load_languages( () => {
				data.load_messages( () => {
			
					var sections = {};
					
					var loaded = 0;
					files.forEach( function( file ) {
						var module = require( '../' + sectiondir + '/' + file );
						var done = function( viewdata ) {
							sections[ module.view ] = viewdata ? viewdata : {};
							loaded++;
							if ( loaded == files.length ) {
							
								data.set_language( req.language );
								
								res.render( 'index.html.twig', {
									'languages' : data.languages,
									'language' : req.language,
									'settings' : data.settings.i18n[ req.language ],
									'sections' : sections,
									'config' : data.config,
									'js' : data.js,
									'css' : data.css,
									'messages' : data.messages,
								});
							}
							
						}
						if ( module.prepare ) {
							module.prepare( done );
						}
						else
							return done();
					});
					
				});
			});
		}
			
		data.app.get( '/', function( req, res ) {
			var selected_language = data.settings.default_language;
			var to_try = [];
			to_try = to_try.concat([
				req.locale.toString(),
				req.locale.language,
			]);
			to_try.some( lang => {
				if ( data.languages[ lang ] ) {
					selected_language = lang;
					return true;
				}
				return false;
				
			});
			res.redirect( '/' + selected_language );
		});
					
		for ( lang in data.languages ) {
			data.app.get( '/' + lang, render_func );
		}
		
		next();
					
	});
}
