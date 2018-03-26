$( document ).ready( function() {
	
	var scrolling_to = null;
	
	$( 'body' ).on( 'click', 'a', function() {
		var href = $(this).attr( 'href' );
		if ( href.substring( 0, 1 ) == '#' ) {
			var target = $( href );
			if ( target.length > 0 ) {
				var target_id = target.attr( 'id' );
				if ( scrolling_to != target_id ) {
					scrolling_to = target_id;
					target.attr( 'id', '' );
					$( 'body' ).addClass( 'hashchange' );
					window.location.hash = href;
					$( 'body' ).removeClass( 'hashchange' );
					target.attr( 'id', target_id );
					$( 'body' ).addClass( 'scrolling' );
					var targettop = target.offset().top;
					if ( $( window ).height() > 300 )
						targettop -= $( 'header' ).height();
					else
						targettop -= 20;
					$( 'html, body' ).stop().animate( {
						scrollTop: targettop,
					}, 400, function() {
						scrolling_to = null;
						$( 'body' ).removeClass( 'scrolling' );
					} );
				}
			}
			return false;
		}
	});
	
	var checkhash = function() {
		if ( !$( 'body' ).hasClass( 'hashchange' ) )
		{
			var menu = $( 'a[href="' + window.location.hash + '"]' );
			if ( menu.length > 0 )
				menu.click();
			else {
				$( 'a[href="#home"]' ).click();
				$( window ).scrollTop( 0 );
			}
		}
		$( '.languages a' ).each( function() {
			var href = $(this).attr( 'href' );
			var strpos = href.indexOf( '#' );
			if ( strpos >= 0 )
				href = href.substring( 0, strpos );
			$(this).attr( 'href', href + window.location.hash );
		});
	};
	
	$( window ).bind( 'hashchange', checkhash);
	setTimeout( checkhash, 1 );
	
});
