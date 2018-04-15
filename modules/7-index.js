exports.run = function( data, next ) {

		var render_func = function( req, res ) {
			
			data.load_languages( () => {
				data.load_messages( () => {
					
					data.sql.query( 'SELECT * FROM `sections` WHERE `enabled` = 1 ORDER BY `order` ASC', [], ( err, results ) => {
					
						var loaded = 0;
						var sections = {};
						
						var done = function( sectiondata ) {
							sections[ sectiondata.section ] = sectiondata;
							loaded++;
							if ( loaded == results.length ) {
							
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
						
						results.forEach( result => {
							var sectiondata = result;
							var module = null;
							try {
								module = require( '../modules/sections/' + result.section + '.js' );
							} catch ( e ) {
								if ( e.code !== 'MODULE_NOT_FOUND' )
									throw e;
							}
							if ( module ) {
								if ( module.prepare ) {
									module.prepare( viewdata => {
										sectiondata.data = viewdata;
										done( sectiondata );
									});
								}
								else
									return done( sectiondata );
							}
							else
								return done( sectiondata );
						});
						
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
					
}
