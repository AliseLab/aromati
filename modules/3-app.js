exports.run = function( data, next ) {
	
	data.express = require( 'express' );

	data.app = data.express();

	next();
}
