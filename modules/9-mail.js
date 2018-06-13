exports.run = function( data, next ) {
	
	var BodyParser = require( 'body-parser' );
	var Mailer = require( 'nodemailer' );
	
	data.app.use( BodyParser.urlencoded( {
		extended: false,
	} ));
	
	data.app.post( '/mail', function( req, res ) {
		
		var dt = req.body;
		
		var error = null;
		
		var done = function() {
			message = error ? 'mail_error_' + error : 'mail_success';
			if ( dt.lang )
				message = data.trans( message, dt.lang );
			res.end( JSON.stringify( {
				success: error ? false : true,
				message: message,
			}));
		}
		
		if ( !dt.lang )
			error = 'invalid_request';
		else if ( !dt.name )
			error = 'enter_name';
		else if ( !dt.email && !dt.phone )
			error = 'enter_email_or_phone';
		else if ( !dt.message )
			error = 'enter message';
		
		if ( error )
			done();
		else {
		
			data.sql.query( 'SELECT `value_text` FROM `settings` WHERE `key` = ?', [ 'mail_settings' ], ( err, results ) => {
			
				if ( err ) {
					console.log( err );
					error = 'internal_error';
					done();
				}
				else {
					
					if ( !results[0] ) {
						console.log( 'error: missing mail settings' );
						error = 'internal_error';
						done();
					}
					else {
					
						var transport = Mailer.createTransport( JSON.parse( results[0].value_text ) );
						
						var title = 'Aromati contact from ' + dt.email;
						
						data.twig.renderFile( './views/mail.html.twig', {
							title: title,
							data: dt
						}, ( err, html ) => {
							
							if ( err ) {
								console.log( err );
								error = 'internal_error';
								done();
							}
							else {
								
								if ( !data.settings.i18n[ dt.lang ].email ) {
									console.log( 'error: missing email setting' );
									error = 'internal_error';
									done();
								}
								var email = data.settings.i18n[ dt.lang ].email;
								
								var mailOptions = {
									from: email,
									to: email,
									subject: title,
									html: html,
								};
								
								transport.sendMail( mailOptions, function( err, info ) {
									if ( err ) {
										console.log( err );
										error = 'unable_to_send';
									} else {
										console.log( 'Email sent: ' + info.response );
									}
									done();
								});
							}
							
						});
					}
				}
			});
		}
	});
	
	next();
	
}
