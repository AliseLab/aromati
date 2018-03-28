exports.run = function( data, next ) {

	var sections = {};
	
	var render_func = function( req, res ) {
		
		res.render( 'index.html.twig', {
			'languages' : data.languages,
			'language' : req.language,
			'settings' : data.settings.i18n[ req.language ],
			'sections' : sections[ req.language ],
			'config' : data.config,
			'mailresult' : req.query.mailresult,
			'js' : data.js,
			'css' : data.css,
			'portfolio_images' : data.portfolio_images,
		});
	}
	
	data.app.get( '/', function( req, res ) {
		var selected_language = data.settings.default_language;
		var to_try = [];
		to_try = to_try.concat([
			req.locale.toString(),
			req.locale.language,
		]);
		to_try.some( lang => {
			if ( data.languages[ lang ] ) {
				selected_language = lang;
				return true;
			}
			return false;
			
		});
		res.redirect( '/' + selected_language );
	});
	
	for ( lang in data.languages ) {
		data.app.get( '/' + lang, render_func );
	}
	
	data.load_sections = ( next ) => {
		for ( lang in data.languages ) {
			sections[ lang ] = {};
			sections[ lang ].sections = {};
		}
		data.sql.query( 'SELECT `name`, `title`, `language`, `data`, `special` from `sections` ORDER BY `order` ASC', [], ( err, results, fields ) => {
			if ( err ) {
				console.log( err );
			}
			else {
				results.forEach( result => {
					if ( !result.special )
						sections[ result.language ].sections[ result.name ] = result;
					else
						sections[ result.language ][ result.special ] = result;
				});
				next();
			}
		});
	};
	data.load_sections( next );
}
