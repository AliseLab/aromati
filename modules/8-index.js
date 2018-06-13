exports.run = function( data, next ) {

		var render_func = function( req, res ) {
			
			data.load_languages( () => {
				data.load_messages( () => {
					data.update_images( () => {
					
						var qry = 'SELECT * FROM `sections`';
						if ( !req.is_admin )
							qry += ' WHERE `enabled` = 1';
						qry += ' ORDER BY `order` ASC';
						data.sql.query( qry, [], ( err, results ) => {
						
							if ( err ) {
								console.log( err );
								res.end( '' );
							}
							else {
							
								var loaded = 0;
								var sections = {};
								
								var done = function( sectiondata ) {
									sections[ sectiondata.section ] = sectiondata;
									loaded++;
									if ( loaded == results.length ) {
									
										data.sql.query( 'SELECT * FROM `collections` ORDER BY `order` ASC', [], ( err, results ) => {
											if ( err ) {
												console.log( err );
											}
											else {
												
												var collections = {};
												
												results.forEach( result => {
													if ( typeof collections[ result.type ] === 'undefined' )
														collections[ result.type ] = [];
													collections[ result.type ].push( result );
												});
										
												var css = JSON.parse( JSON.stringify( data.css ) );
												if ( req.is_admin )
													css.push( 'admin.css' );
												var js = JSON.parse( JSON.stringify( data.js ) );
												if ( req.is_admin ) {
													js.push( 'admin.js' );
													js.push( 'admin_upload.js' );
												}
												
												var renderdata = {
													'languages' : data.languages,
													'language' : req.language,
													'settings' : data.settings.i18n[ req.language ],
													'sections' : sections,
													'config' : data.config,
													'js' : js,
													'css' : css,
													'messages' : data.messages,
													'is_admin' : req.is_admin,
													'req' : req,
													'collections' : collections,
													'mail_error_internal_error' : data.trans( 'mail_error_internal_error', req.language ),
												};
												
												var renderfunc = () => {
													res.render( 'index.html.twig', renderdata );
												}
												
												if ( req.is_admin ) {
													data.sql.query( 'SELECT * FROM `settings` LEFT JOIN `trans` ON `trans`.`id` = `settings`.`value_trans`', [], ( err, results ) => {
														if ( err )
															console.log( err );
														else {
															var settings = {};
															results.forEach( result => {
																var setting = {
																	key: result.key,
																	translatable: result.translatable,
																};
																if ( result.key == 'mail_settings' )
																	setting.value = JSON.parse( result.value_text );
																else {
																	if ( result.value_trans ) {
																		if ( settings[ result.key ] )
																			setting = settings[ result.key ];
																		else
																			setting.value = {};
																		setting.value[ result.language ] = result.text;
																	}
																	else
																		setting.value = result.value_text;
																}
																settings[ result.key ] = setting;
															});
															renderdata.editsettings = settings;
															renderfunc();
														}
													});
												}
												else
													renderfunc();
											}
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
							}
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
		
		data.twig.extendFunction( 'section', ( req, section, dt ) => {

			var section = '<div class="section';
			
			if ( req.is_admin ) {
				if ( !dt.enabled )
					section += ' disabled';
				section += '" data-section="' + data.makeeditable( dt );
			}
			
			section += '">';
			
			return section;
		});

		next();
					
}
