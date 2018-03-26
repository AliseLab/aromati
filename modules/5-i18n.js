exports.run = function( data, next ) {
	
	// TODO: data.languages
	data.languages = { 'en' : 'En' };
	
	var Locale = require( 'express-locale' );
	var locale = Locale();

	data.messages = {};
	data.languages = {};
	
	var set_locale = function ( req, res, next ) {
		var selected_language = 'en'; // TODO: get from db
		var lang = req.url.substring( 1 );
		var i = lang.indexOf( '?' );
		if ( i >= 0 )
			lang = lang.substring( 0, i );
		if ( lang.length > 0 ) {
			if ( data.languages[ lang ] )
				selected_language = lang;
			req.locale.toString = function() {
				return selected_language;
			}
		}
		req.language = req.locale.toString();
		next();
	}
	
	data.app.use( locale );
	data.app.use( set_locale );
	
	next();

}
