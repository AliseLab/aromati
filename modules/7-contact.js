exports.run = function( data, next ) {
	
	var BodyParser = require( 'body-parser' );
	var Mailer = require( 'nodemailer' );
	
	data.app.use( BodyParser.urlencoded( {
		extended: false,
	} ));
	
	data.app.post( '/contact', function( req, res ) {
		
		var transport = Mailer.createTransport( data.getconfig( req.language ).mail.transport );
		
		var title = 'Aliselab contact from ' + req.body.email;
		
		// TODO: get template from db
		/*data.twig.renderFile( './views/mail.html.twig', {
			title: title,
			data: req.body
		}, ( err, html ) => {
			
			var mailOptions = {
				from: req.body.email,
				to: data.getconfig( req.language ).mail.destination,
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
				url += '#contacts';
				res.redirect( url );
			}); 
			
		});*/
		
	});
	
	next();
	
}
