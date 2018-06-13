$( document ).ready( function() {
	var form = $( '.contact-form' );
	var closing = false;
	
	var openfunc = function() {
		form.stop( true ).fadeIn( 'fast', function() {
			
		});
		return false;
	}
	var closefunc = function() {
		if ( !closing ) {
			closing = true;
			form.stop( true ).fadeOut( 'fast', function() {
				closing = false;
			});
		}
		return false;
	}
	
	form.on( 'click', function(e) {
		if ( $( e.target ).closest( 'form' ).length <= 0 )
			closefunc();
	});
	form.on( 'click', '.close', closefunc );
	$( 'a.contact' ).on( 'click', openfunc );
});

