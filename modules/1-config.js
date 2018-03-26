/*var deep_merge = ( a, b ) => {
	var ret = JSON.parse( JSON.stringify( a ) );
	for ( var k in b ) {
		if ( typeof( ret[ k ] ) === 'object' ) {
			ret[ k ] = deep_merge( ret[ k ], b[ k ] );
		}
		else {
			ret[ k ] = b[ k ];
		}
	}
	return ret;
}
*/

exports.run = function( data, next ) {
	
	data.config = require( '../config.js' ).config;
	
	// TODO: needed?
	/*var config_i18n = {};
	
	data.fs.readdir( './messages', ( err, files ) => {
		files.forEach( file => {
			var lang = file.replace( /\.js/, '' );
			try {
				var custom_config = require( '../config.' + lang + '.js' ).config;
				config_i18n[ lang ] = deep_merge( data.config, custom_config );
			} catch ( e ) {
				config_i18n[ lang ] = deep_merge( data.config, {} );
			}
		});
		next();
	});
	
	data.getconfig = ( language ) => {
		if ( typeof( config_i18n[ language ] ) !== 'undefined' )
			return config_i18n[ language ];
		else
			return data.config;
	};*/
	
	next();
}
