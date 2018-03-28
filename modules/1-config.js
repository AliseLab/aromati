exports.run = function( data, next ) {
	
	data.config = require( '../config.js' ).config;
	
	data.settings = {};
	
	data.load_settings = ( next ) => {
		data.settings = {};
		
		data.sql.query( '\
			SELECT `settings`.`key`, `settings`.`value_text` AS value, `trans`.`language`, `trans`.`text` AS value_i18n FROM `settings`\
			LEFT JOIN `trans` ON `trans`.`id` = `settings`.`value_trans`\
		', [], ( err, results, fields ) => {
			if ( err )
				console.log( err );
			else {
				data.settings.i18n = {};
				for ( lang in data.languages ) {
					data.settings.i18n[ lang ] = {};
					results.forEach( result => {
						var value = null;
						if ( result.value_i18n && result.language == lang )
							value = result.value_i18n;
						else {
							data.settings[ result.key ] = result.value;
							if ( typeof data.settings.i18n[ lang ][ result.key ] === 'undefined' )
								value = result.value;
						}
						if ( value )
							data.settings.i18n[ lang ][ result.key ] = value;
					});
				}
				next();
			}
		});
	};
	
	next();
}
