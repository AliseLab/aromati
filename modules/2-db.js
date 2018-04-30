exports.run = function( data, next ) {
	
	var db_version = '1.0.0';
	
	var Mysql = require( 'mysql2' );
	
	data.config.db.multipleStatements = true;
	
	var initialized = false;
	var init = function() {
		var failed = false;
		var fail = ( msg ) => {
			console.log( 'fail', msg );
			data.sql.close();
			failed = true;
		}
		
		data.sql.query( 'SELECT `db_version` FROM `_meta`', ( err, results, fields ) => {
			var update_needed = false;
			
			if ( err ) {
				if ( err.code == 'ER_NO_SUCH_TABLE' ) {
					update_needed = true;
				}
				else {
					return fail( err.sqlMessage ? err.sqlMessage : err.toString() );
				}
			}
			else {
				results.forEach( result => {
					if ( result.db_version != db_version ) {
						console.log( 'Invalid DB version ( needed ' + db_version + ', found ' + result.db_version + ' ), please migrate' );
						failed = true;
					}
				});
			}
			
			if ( !failed ) {
				
				if ( update_needed ) {
					console.log( 'loading fixtures...' );
					data.fs.readdir( './fixtures', ( err, files ) => {
						if ( err )
							return fail( err );
						else {
							var loaded = 0;
							var done = () => {
								if ( ++loaded == files.length ) {
									console.log( 'done' );
									next();
								}
							};
							
							files.forEach( file => {
								console.log( '\t' + file );
								data.fs.readFile( './fixtures/' + file, ( err, data ) => {
									if ( err )
										return fail( err );
									data.sql.query( data.toString(), ( err, results, fields ) => {
										if ( err )
											return fail( err.sqlMessage );
										done();
									});
								});
							});
						}
					});
				}
				else
					next();
			}

		});
	}
	
	var doconnect = function() {
		data.sql = Mysql.createConnection( data.config.db );
		data.sql.on( 'connect', () => {
			console.log( 'db connected' );
			if ( !initialized ) {
				initialized = true;
				init();
			}
		});
		data.sql.on( 'error', err => {
			console.log( err.toString() );
			if ( !err.fatal )
				return;
			console.log( 'reconnecting db' );
			data.sql.close();
			setTimeout( doconnect, 100 );
		});
	};
	doconnect();
	
}
