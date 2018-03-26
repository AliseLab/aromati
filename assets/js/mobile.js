$( document ).ready( function() {
	
	var header_minimize_min_window_height = 300;
	var header_minimize_to_height = 20;
	
	var header = $( 'header' );
	var nav = header.find( 'nav' );
	
	header.find( '.mobile-menu' ).on( 'click', function() {
		var btn = $(this);
		if ( btn.hasClass( 'active' ) ) {
			btn.removeClass( 'active' );
			nav.removeClass( 'mobile-visible' );
		}
		else {
			btn.addClass( 'active' );
			nav.addClass( 'mobile-visible' );
		}
	});
	
	header.find( 'a' ).on( 'click', function() {
		var btn = $( 'header .mobile-menu' );
		if ( btn.hasClass( 'active' ) ) {
			btn.removeClass( 'active' );
			nav.removeClass( 'mobile-visible' );
		}
	});

	var alignheader = function() {
		nav.css( 'top', header.outerHeight() + 'px' );
	};
	
	var showheader = function() {
		header.stop().removeClass( 'hiding' ).removeClass( 'hidden' ).css( {
			top: '0px',
			opacity: '1',
		} );
	}
	
	var hideheader = function( speed ) {
		if ( !header.hasClass( 'hiding' ) ) {
			header.addClass( 'hiding' );
			header.stop().css( 'overflow', 'hidden' ).animate({
				top: '-' + ( header.height() - header_minimize_to_height ) + 'px',
				opacity: '0.5',
			}, speed, function() {
				header.removeClass( 'hiding' ).addClass( 'hidden' );
			} );
		}
	}
	
	var maybehideheader = function( speed ) {
		if (
			$( window ).height() <= header_minimize_min_window_height &&
			$( window ).scrollTop() > 0 &&
			!nav.hasClass( 'mobile-visible' )
		)
			hideheader( speed );
	}
	
	var headerclicked = false;
	
	$( 'body' ).on( 'mousedown', function() {
		if ( headerclicked ) {
			showheader();
			headerclicked = false;
		}
		else
			maybehideheader( 'fast' );
	});
	
	header.on( 'mousedown', function() {
		headerclicked = true;
	});
	
	$( window ).on( 'scroll', function() {
		if ( $( window ).scrollTop() == 0 )
			showheader();
		else
			maybehideheader( 'slow' );
	});
	
	var onresize = function() {
		alignheader();
		showheader();
	};
	
	$( window ).on( 'resize', onresize );
	onresize();
	
});
