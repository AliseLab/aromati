$( document ).ready( function() {
	var formdiv = $( '.contact-form' );
	var form = formdiv.find( 'form' );
	var result = form.find( '.result' );

	var clearform = function() {
		formdiv.find( 'input[type!="hidden"], textarea' ).each( function() {
			$(this).val( '' );
		});
	}
	
	form.on( 'submit', function( e ) {
		
		var btn = form.find( 'button' );
		
		btn.addClass( 'disabled' ).attr( 'disabled', true );
		
		e.preventDefault();
		
		var done = function( data ) {
			btn.removeAttr( 'disabled' ).removeClass( 'disabled' );
			if ( data.success ) {
				result.removeClass( 'error' ).addClass( 'success' );
				clearform();
			}
			else
				result.removeClass( 'success' ).addClass( 'error' );
			result.html( data.message );
		}
		
        $.ajax({
            type: form.attr( 'method' ),
            url: form.attr( 'action' ),
            data: form.serialize(),
            success: function ( data ) {
                done( JSON.parse( data ) );
            },
            error: function ( data ) {
            	done( data, {
            		success: false,
            		message: mail_error_internal_error,
            	});
            },
        });
		
		return false;
	});
});
