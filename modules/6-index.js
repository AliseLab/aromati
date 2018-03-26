exports.run = function( data, next ) {

	var render_func = function( req, res ) {
		res.render( 'index.html.twig', {
			'languages' : data.languages,
			'language' : req.language,
			// TODO: needed?
			//'config' : data.getconfig( req.language ),
			'config' : data.config,
			'mailresult' : req.query.mailresult,
			'js' : data.js,
			'css' : data.css,
			'portfolio_images' : data.portfolio_images,
		});
	}
	
	data.app.get( '/', function( req, res ) {
		var selected_language = 'en'; // TODO: get from db
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
		// TODO: multilang res.redirect( '/' + selected_language );
		render_func( req, res );
	});
	
	for ( lang in data.languages ) {
		data.app.get( '/' + lang, render_func );
	}
	
	next();
}
