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
			
		translate: {
			
			save: ( what, next ) => {
				
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
	
	next();
	
}
