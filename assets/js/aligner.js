$( document ).ready( function() {
	
	var align = function() {
		var headerh = $( 'header' ).height();
		$( 'section' ).each( function() {
			var section = $(this);
			var article = section.find( 'article' );
			var h1 = section.find( '> h1 ');
			if ( article.length > 0 && h1.length > 0 ) {
				
				article.css( 'position', 'absolute' );
				
				var sectionh = $( window ).innerHeight() - headerh;
				var sectionw = section.innerWidth();
				var articleh = article.outerHeight();
				var articlew = article.outerWidth();
				var h1h = h1.outerHeight();
				
				var paddingh = ( section.outerHeight()- section.height() ) / 2;
				var paddingw = ( section.outerWidth()- section.width() ) / 2;
				
				article.css( 'left', ( sectionw - articlew + paddingw ) / 2 + 'px' );
				
				if ( sectionh - h1h > articleh ) {
					article.css( 'top', ( sectionh - articleh ) / 2 + h1h + 'px' );
					section.css( 'height', sectionh - paddingh * 2 + 'px' );
				}
				else if ( sectionh - h1h < articleh ) {
					article.css( 'position', 'static' );
					section.css( 'height', ( articleh + h1h + headerh ) + 'px' );
				}
			}
		});
	}
	
	$( window ).on( 'resize', align );
	setTimeout( align, 100 );
	
});
