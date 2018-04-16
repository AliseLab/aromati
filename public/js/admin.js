$( document ).ready( function() {
	
	var admin_panel = $( '.admin-panel' );
	var admin_panel_tools = admin_panel.find( '> .tools' );
	
	var savebtn = admin_panel.find( '.save' );
	
	var body = $( '.main-wrapper' );
	
	var set_unsaved = function( el ) {
		el.addClass( 'unsaved' );
		savebtn.removeClass( 'disabled' );
	}
	
	var tools = {
			
		pageedit: {

			construct: function() {
				
			},
			init: function( el, data ) {
				el
					.on( 'blur keyup paste input', function() {
						if ( $(this).hasClass( 'active' ) ) {
							set_unsaved( el );
						}
					})
				;
				var datatype = el.attr( 'data-type' );
				switch ( datatype ) {
					case 'html': {
						el.html( data.text );
						break;
					}
					case 'placeholder': {
						el.attr( 'placeholder', data.text );
						break;
					}
					default: {
						console.log( datatype + '???' );
					}
				}
			},
			enable: function( el, data ) {
				var datatype = el.attr( 'data-type' );
				switch ( datatype ) {
					case 'html': {
						el.attr( 'contenteditable', true );
						break;
					}
					case 'placeholder': {
						el.val( el.attr( 'placeholder' ) );
						break;
					}
					default: {
						console.log( datatype + '???' );
					}
				}
			},
			disable: function( el, data ) {
				var datatype = el.attr( 'data-type' );
				switch ( datatype ) {
					case 'html': {
						el.attr( 'contenteditable', false );
						break;
					}
					case 'placeholder': {
						el.attr( 'placeholder', el.val() );
						el.val( '' );
						break;
					}
					default: {
						console.log( datatype + '???' );
					}
				}
			},
			save: function( el, data ) {
				var datatype = el.attr( 'data-type' );
				switch ( datatype ) {
					case 'html': {
						data.text = el.html();
						break;
					}
					case 'placeholder': {
						if ( el.hasClass( 'active' ) )
							data.text = el.val();
						else
							data.text = el.attr( 'placeholder' );
						break;
					}
					default: {
						console.log( datatype + '???' );
					}
				}
				
			},
		},
	
	}
	
	savebtn.on( 'click', function() {
		if ( !$(this).hasClass( 'disabled' ) ) {
			
			var request = {
				language: global.language,
				data: [],
			};
			$( '.editable.unsaved' ).each( function() {
				var data = JSON.parse( $(this).attr( 'data-data' ) );
				tools[ data.tool ].save( $(this), data );
				request.data.push( data );
				$(this).removeClass( 'unsaved' );
			});
			
			$.post( '/admin/save', {
				data: JSON.stringify( request ),
			}, function( ret ) {
				console.log( ret );
				savebtn.addClass( 'disabled' );
			})
		}
	});
	
	var settool = function( tool ) {
		$( '.editable' ).each( function() {
			var data = JSON.parse( $(this).attr( 'data-data' ) );
			if ( $(this).hasClass( 'active' ) && data.tool != tool ) {
				tools[ data.tool ].disable( $(this), data );
				$(this).removeClass( 'active' );
			}
			if ( !$(this).hasClass( 'active' ) && data.tool == tool ) {
				$(this).addClass( 'active' );
				tools[ data.tool ].enable( $(this), data );
			}
		});
	}
	
	admin_panel_tools.on( 'click', '> span', function() {
		var tool = $( this );
		if ( !tool.hasClass( 'active' ) ) {
			admin_panel_tools.find( '> span' ).removeClass( 'active' );
			tool.addClass( 'active' );
		}
		else
			tool.removeClass( 'active' );
		var active = admin_panel_tools.find( '> span.active' );
		if ( active.length > 0 ) {
			settool( active.attr( 'data-tool' ) );
		}
		else
			settool();
	});

	for ( tool in tools ) {
		if ( tools[tool].construct )
			tools[tool].construct();
	}
	
	// search and init tools
	$( '*' ).each( function() {
		var el = $(this);
		var trysource = function( source, type ) {
			if ( source && source.indexOf( '!@#' ) === 0 ) {
				var data = JSON.parse( source.substring( 3 ) );
				el
					.addClass( 'editable' )
					.addClass( data.tool )
					.attr( 'data-type', type )
					.attr( 'data-data', source.substring( 3 ) )
				;
				tools[ data.tool ].init( el, data );
				return true;
			}
			return false;
		}
		
		trysource( el.html(), 'html' ) ||
		trysource( el.attr( 'placeholder' ), 'placeholder' );
	});
	
});
