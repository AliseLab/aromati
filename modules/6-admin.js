exports.run = function( data, next ) {

	var md5 = require('md5');
	
	var CookieParser = require('cookie-parser');
	data.app.use( CookieParser() );
	
	var check_admin = function ( req, res, next ) {
		if ( req.cookies.admin ) {
			var qry = 'SELECT `cookie` FROM `admin_sessions` WHERE `cookie` = ?';
			var args = [ req.cookies.admin ];
			
			if ( data.config.admin.check_ip ) {
				qry += ' AND `remote_addr` = ?';
				args.push( req.connection.remoteAddress );
			}
			
			data.sql.query( qry, args, ( err, results ) => {
				if ( err )
					console.log( err );
				else {
					req.is_admin = results.length > 0;
					if ( req.is_admin )
						res.cookie( 'admin', req.cookies.admin, { maxAge: 99999999999 } )
					next();
				}
			});
		}
		else {
			req.is_admin = false;
			next();
		}
	}
	data.app.use( check_admin );
	
	data.app.get( '/admin', function( req, res ) {
		if ( req.is_admin )
			res.redirect( '/' );
		else {
			res.render( 'adminlogin.html.twig', {
				'settings' : data.settings.i18n[ req.language ],
				'css' : [],
				'js' : [],
			});
		}
	});
	
	var tools = {
			
		pageedit: {
			
			save: ( what, next ) => {
				if ( what.msgid ) { // translation
					var keystr = '`id`, `language`, `text`';
					var valstr = '?, ?, ?';
					var args = [
						what.msgid,
						what.request.language,
						what.text,
					];
					if ( what.object_type && what.object_id ) {
						keystr += ', `object_type`, `object_id`';
						valstr += ', ?, ?';
						args.push( what.object_type );
						args.push( what.object_id );
					}
					
					args.push( what.text );
					
					data.sql.query( 'INSERT INTO `trans` ( ' + keystr + ' ) VALUES ( ' + valstr + ' ) ON DUPLICATE KEY UPDATE `text` = ?', args, function( err ) {
						if ( err )
							console.log( err );
						else {
							next();
						}
					});
				}
				else if ( what.collection ) { // collection
					var toadd = [];
					var toremove = [];
					what.ids.forEach( id => {
						if ( what.new_ids.indexOf( id ) < 0 )
							toremove.push( id );
					});
					what.new_ids.forEach( id => {
						if ( what.ids.indexOf( id ) < 0 )
							toadd.push( id );
					});
					
					//console.log( 'ADD', toadd );
					//console.log( 'REMOVE', toremove );
					
					var queries = [];
					toremove.forEach( id => {
						queries.push({
							sql: 'DELETE FROM `trans` WHERE `object_type` = ? AND `object_id` = ?',
							args: [ what.collection.type, id ],
						});
						queries.push({
							sql: 'DELETE FROM `collections` WHERE `type` = ? AND `id` = ? LIMIT 1',
							args: [ what.collection.type, id ],
						});
					});
					toadd.forEach( id => {
						queries.push({
							sql: 'INSERT INTO `collections` ( `type`, `id` ) VALUES ( ?, ? )',
							args: [ what.collection.type, id ],
						});
					});
					
					if ( queries.length > 0 ) {
						
						//console.log( 'START' );
						
						var i = 0;
	
						var nextquery = () => {
							var query = queries[ i ];
							//console.log( 'QUERY', query );
							data.sql.query( query.sql, query.args, ( err, results ) => {
								if ( err ) {
									console.log( err );
								}
								else {
									i++;
									if ( i < queries.length )
										return nextquery();
									else {
										//console.log( 'DONE' );
										return next();
									}
								}
							});
						};
						nextquery();
					}
					else
						next();
				}
				else if ( what.section ) {
					var qry = 'UPDATE `sections` SET';
					var args = [];
					var first = true;
					for ( var k in what ) {
						if ( k != 'section' && k != 'tool' && k != 'request' ) {
							var v = what[ k ];
							if ( first )
								first = false;
							else
								qry += ', ';
							qry += '`' + k + '` = ?',
							args.push( v );
						}
					}
					qry += ' WHERE `section` = ? LIMIT 1';
					args.push( what.section );
					data.sql.query( qry, args, ( err, results ) => {
						if ( err )
							console.log( err );
						else
							next();
					} )
					next();
				}
				else {
					console.log( '???', what );
					next();
				}
			},
			
		},
	};
	
	
	data.app.post( '/admin/save', function( req, res ) {
		if ( req.is_admin ) {
			var request = JSON.parse( req.body.data );
			
			var saved = 0;
			var done = () => {
				saved++;
				if ( saved == request.data.length ) {
					res.send( 'OK' );
				}
			}
			
			
			request.data.forEach( what => {
				what.request = request;
				tools[ what.tool ].save( what, done );
			});
			
		}
		else
			res.status( 403 ).send( '' );
	});
	
	data.app.post( '/admin', function( req, res ) {
		if ( req.is_admin ) {
			red.redirect( '/' );
		}
		else if ( req.body.password == data.settings.admin_password ) {
			
			var generate_cookie = ( next ) => {
				var cookie = md5( Math.random() % 99999999999 ) + md5( Math.random() % 99999999999 ) + md5( Math.random() % 99999999999 ) + md5( Math.random() % 99999999999 );
				data.sql.query( 'SELECT `cookie` from `admin_sessions` WHERE `cookie` = ?', [ cookie ], ( err, results ) => {
					if ( err )
						console.log( err );
					else {
						if ( results.length > 0 )
							return generate_cookie( next );
						else return next( cookie );
					}
				});
			}
			
			generate_cookie( cookie => {
				data.sql.query( 'INSERT INTO `admin_sessions` ( `cookie`, `remote_addr`, `last_access` ) VALUES ( ?, ?, NOW() )', [ cookie, req.connection.remoteAddress ], ( err, results ) => {
					if ( err )
						console.log( err );
					else {
						console.log( 'admin login from', req.connection.remoteAddress );
						res.cookie( 'admin', cookie, { maxAge: 99999999999 } )
					}
					res.redirect( '/' );
				});
			});
		}
		else {
			res.redirect( '/admin' );
		}
	});
	
	data.app.get( '/logout', function( req, res ) {
		if ( req.is_admin ) {
			data.sql.query( 'DELETE FROM `admin_sessions` WHERE `cookie` = ? AND `remote_addr` = ?', [ req.cookies.admin, req.connection.remoteAddress ], ( err, results ) => {
				if ( err )
					console.log( err );
				else {
					console.log( 'admin logout from', req.connection.remoteAddress );
				}
				res.clearCookie( 'admin' );
				res.redirect( '/' );
			});
		}
		else
			res.redirect( '/' );
	});
	
	function escapeQuotes( unsafe ) {
		return unsafe
			.replace( /"/g, "&quot;" )
			.replace( /'/g, "&#039;" )
		;
	}
	
	function escapeHtml( unsafe ) {
		return unsafe
			.replace( /&/g, "&amp;" )
			.replace( /</g, "&lt;" )
			.replace( />/g, "&gt;" )
			.replace( /"/g, "&quot;" )
			.replace( /'/g, "&#039;" )
		;
	}
	
	data.makeeditable = function( data ) {
		data.tool = 'pageedit';
		var ret = '!@#' + escapeHtml( JSON.stringify( data ) );
		return ret;
	}
	
	data.twig.extendFunction( 'collection', ( req, objects, type ) => {
		if ( req.is_admin ) {
			var data = {
				tool : 'pageedit',
				collection : {
					type : type,
				},
			};
			data.ids = [];
			for ( var i in objects )
				data.ids.push( objects[ i ].id );
			return ' data-collectiontype="' + type + '" data-collection="!@#' + escapeHtml( JSON.stringify( data ) ) + '" ';
		}
		return '';
	});

	next();
	
}
