exports.run = function( data, next ) {

	var md5 = require('md5');
	
	var CookieParser = require('cookie-parser');
	data.app.use( CookieParser() );
	
	var admin_ip = null;
	var admin_cookie = null;
	
	var check_admin = function ( req, res, next ) {
		req.is_admin = (
			( req.cookies.admin == admin_cookie ) &&
			( req.connection.remoteAddress == admin_ip )
		);
		
		req.is_admin = true; // tmp
		
		next();
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
					data.sql.query( 'INSERT INTO `trans` ( `id`, `language`, `text` ) VALUES ( ?, ?, ? ) ON DUPLICATE KEY UPDATE `text` = ?', [
						what.msgid,
						what.request.language,
						what.text,
						what.text,
					], function( err ) {
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
					
					var i = 0;
					var done = () => {
						i++;
						if ( i == queries.length ) {
							console.log( 'done' );
							next();
						}
					}
					
					queries.forEach( query => {
						data.sql.query( query.sql, query.args, ( err, results ) => {
							if ( err ) {
								console.log( err );
							}
							else
								done();
						})
					});
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
					
					res.send( '' );
					
				}
			}
			
			
			request.data.forEach( what => {
				what.request = request;
				tools[ what.tool ].save( what, done );
			});
			
		}
		else {
			res.status( 403 ).send( '' );
		}
	});
	
	data.app.post( '/admin', function( req, res ) {
		if ( req.is_admin ) {
			red.redirect( '/' );
		}
		else if ( req.body.password == data.settings.admin_password ) {
			admin_ip = req.connection.remoteAddress;
			admin_cookie = md5( Math.random() % 99999999999 );
			res.cookie( 'admin', admin_cookie, { maxAge: 900000 } )
			res.redirect( '/' );
		}
		else {
			res.redirect( '/admin' );
		}
	});
	
	data.app.get( '/logout', function( req, res ) {
		if ( req.is_admin ) {
			admin_ip = null;
			admin_cookie = null;
			res.clearCookie( 'admin' );
		}
		res.redirect( '/' );
	});
	
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
		return '!@#' + escapeHtml( JSON.stringify( data ) );
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
			return ' data-collection="!@#' + escapeHtml( JSON.stringify( data ) ) + '" ';
		}
		return '';
	});

	next();
	
}
