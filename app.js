var { exec } = require( 'child_process' );

var data = {
	fs: require( 'fs' ),
	modules: {},
	exec: exec,
};

data.fs.readdir( './modules', ( err, files ) => {
	files.forEach( file => {
		data.modules[ file.replace( /\.js/, '' ) ] = require( './modules/' + file );
	});
	var modulenames = [];
	for ( var name in data.modules )
		modulenames.push( name );
	var i = 0;
	var nextmodule = function() {
		if ( i < modulenames.length ) {
			var name = modulenames[ i ];
			var module = data.modules[ name ];
			i++;
			
			module.run( data, nextmodule );
		}
	}
	nextmodule();
});

