exports.run = function( data, next ) {
	
	var BodyParser = require( 'body-parser' );
	data.app.use( BodyParser.urlencoded( {
		extended: false,
	} ));
	
	var Mailer = require( 'nodemailer' );
	var transport = Mailer.createTransport( JSON.parse( data.settings.mail_settings ) );
	
	data.app.post( '/contact', function( req, res ) {
		
		var title = 'Order from ' + req.body.email;
		
		data.twig.renderFile( './views/mail.html.twig', {
			title: title,
			data: req.body
		}, ( err, html ) => {
			
			var mailOptions = {
				from: req.body.email,
				to: data.settings.email,
				subject: title,
				html: html,
			};
			
			transport.sendMail( mailOptions, function( error, info ) {
				url = '/' + req.body.lang + '?mailresult=';
				if ( error ) {
					console.log( error );
					url += 'error';
				} else {
					console.log( 'Email sent: ' + info.response );
					url += 'success';
				}
				res.redirect( url );
			}); 
			
		});
		
	});
	
	next();
	
}
