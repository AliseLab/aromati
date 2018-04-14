exports.run = function( data, next ) {

		var sections = [
			'service', 'contact', 'about', 'letsgo', 'project', 'team', 'price', 'overview', 'contact2'
		];
		
		var render_func = function( req, res ) {
			
			res.render( 'index.html.twig', {
				'languages' : data.languages,
				'language' : req.language,
				'settings' : data.settings.i18n[ req.language ],
				'sections' : sections,
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
		
		next();
}
