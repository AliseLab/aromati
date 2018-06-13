exports.run = function( data, next ) {

	var Locale = require( 'express-locale' );
	var locale = Locale();

	data.messages = {};
	data.languages = {};
	
	var set_locale = function ( req, res, next ) {
		var selected_language = data.settings.default_language;
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
	
	data.load_languages = ( next ) => {
		data.sql.query( 'SELECT `name`, `label` FROM `languages` ORDER BY `order` ASC', [], ( err, results ) => {
			
			if ( err ) {
				console.log( err );
			}
			else {
				data.languages = {};
				results.forEach( result => {
					data.languages[ result.name ] = result.label;
				});
				data.load_settings( next );
			}	
		});
	};
	data.load_languages( next );
	
	data.load_messages = ( next ) => {
		data.sql.query( 'SELECT `id`, `language`, `text` FROM `trans`', [], ( err, results ) => {
			if ( err ) {
				console.log( err );
			}
			else {
				data.messages = {};
				results.forEach( result => {
					if ( typeof data.messages[ result.language ] == 'undefined' )
						data.messages[ result.language ] = {};
					data.messages[ result.language ][ result.id ] = result.text;
				});
				next();
			}
		});
	};
	
	data.trans = function( msgid, lang ) {
		if ( typeof data.messages[ lang ] == 'undefined' || typeof data.messages[ lang ][ msgid ] == 'undefined' )
			return msgid;
		else
			return data.messages[ lang ][ msgid ];
	}
	
	data.twig.extendFunction( 'trans', ( req, msgid, objectuid ) => {
		
		var lang = req.language;
		
		var text = data.trans( msgid, lang );
		
		if ( req.is_admin ) {
			var dt = {
				msgid: msgid,
				text: text,
			};
			if ( objectuid ) {
				var pos = objectuid.indexOf( '_' );
				if ( pos >= 0 ) {
					var type = objectuid.substring( 0, pos );
					var id = objectuid.substring( pos + 1 );
					if ( type && id ) {
						dt.object_type = type;
						dt.object_id = id;
					}
				}
			}
			text = data.makeeditable( dt );
		}
		return text;
		
	});

}
