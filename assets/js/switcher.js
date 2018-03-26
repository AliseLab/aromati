$( document ).ready( function() {
	
	$( '.switcher' ).each( function() {
		var switcher = $(this);
		switcher.on( 'click', 'a', function() {
			switcher.find( 'a' ).removeClass( 'active' );
			$(this).addClass( 'active' );
		});
	});
	
} );
