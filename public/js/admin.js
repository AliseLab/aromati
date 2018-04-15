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
			
		translate: {

			construct: function() {
				
			},
			init: function( el, data ) {
				el
					.on( 'blur keyup paste input', function() {
						set_unsaved( el )
					})
					.html( data.text )
				;
			},
			enable: function( el, data ) {
				el
					.attr( 'contenteditable', true )
				;
			},
			disable: function( el, data ) {
				el
					.attr( 'contenteditable', false )
				;
			},
			save: function( el, data ) {
				data.text = el.html();
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
		var html = $(this).html();
		if ( html ) {
			if ( html.indexOf( '!@#' ) === 0 ) {
				var data = JSON.parse( html.substring( 3 ) );
				$(this)
					.addClass( 'editable' )
					.addClass( data.tool )
					.attr( 'data-data', html.substring( 3 ) )
				;
				tools[ data.tool ].init( $(this), data );
			}
		}
	});
	
	// translate
	/*$( '.editable' ).on( 'click', function( e ) {
		if ( $(this).hasClass( 'active' ) ) {
			var data = JSON.parse( $(this).attr( 'data-data' ) );
			tools[ data.tool ].edit( $(this), data );
			return false;
		}
	});*/
	
	
});
