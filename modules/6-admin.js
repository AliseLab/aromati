exports.run = function( data, next ) {

	var md5 = require('md5');
	
	var CookieParser = require('cookie-parser');
	data.app.use( CookieParser() );
	
	var admin_ip = '::1'; // tmp null;
	var admin_cookie = '62b4f7909557d6062c4a553df2cfec84'; // tmp null;
	
	var check_admin = function ( req, res, next ) {
		req.is_admin = (
			( req.cookies.admin == admin_cookie ) &&
			( req.connection.remoteAddress == admin_ip )
		);
		
		next();
	}
	data.app.use( check_admin );
	
	data.app.get( '/admin', function( req, res ) {
		
		if ( req.is_admin )
			res.redirect( '/' );
		else {
			res.render( 'adminlogin.html.twig', {
				'settings' : data.settings.i18n[ req.language ],
				'css' : [ 'admin.css' ],
				'js' : [],
			});
		}
	});
	
	data.app.post( '/admin', function( req, res ) {
		if ( req.body.password == data.settings.admin_password ) {
			admin_ip = req.connection.remoteAddress;
			admin_cookie = md5( Math.random() % 99999999999 );
			res.cookie( 'admin', admin_cookie, { maxAge: 900000 } )
			res.redirect( '/' );
		}
		else {
			res.redirect( '/admin' );
		}
	});
	
	next();
	
}
