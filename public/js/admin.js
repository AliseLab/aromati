$( document ).ready( function() {
	
	var admin_panel = $( '.admin-panel' );
	var admin_panel_tools = admin_panel.find( '> .tools' );
	
	var savebtn = admin_panel.find( '.save' );
	var logoutbtn = admin_panel.find( '.logout' );
	var errlbl = admin_panel.find( '.error' );
	
	var body = $( '.main-wrapper' );
	
	var autosavetimeout = null;
	var autosave = function() {
		if ( autosavetimeout )
			clearTimeout( autosavetimeout );
		autosavetimeout = setTimeout( function() {
			autosavetimeout = null;
			savebtn.click();
		}, 100 );
	}
	
	var set_unsaved = function( el ) {
		el.addClass( 'unsaved' );
		savebtn.removeClass( 'disabled' );
		//autosave();
	}
	
	$( window ).on( 'beforeunload', function(){
		if ( !savebtn.hasClass( 'disabled' ) )
			return confirm( 'You haven\'t saved changes! Leave this page anyway?' );
	});
	
	function htmlDecode(input){
		  var e = document.createElement('div');
		  e.innerHTML = input;
		  // handle case of empty input
		  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
	}

	logoutbtn.on( 'click', function() {
		if ( !savebtn.hasClass( 'disabled' ) )
			return confirm( 'You havent saved changes, continue to logout?' );
	});
	
	var tools = {
			
		settings: {
			enable: function( el, data ) {
				var setunsaved = function() {
					el.find( '.submit' ).removeClass( 'disabled' ).removeAttr( 'disabled' );
				};
				el.find( 'input,select' ).on( 'change', setunsaved );
				el.find( 'input,select' ).on( 'keydown', setunsaved );
				el.find( '.trans > input' ).on( 'change', function() {
					var valtd = $(this).closest( 'tr ').find( '> td.value' );
					var single = valtd.find( '> .lang.single' );
					var multi = valtd.find( '> .lang.multi' );
					if ( $(this).is( ':checked' ) ) {
						single.removeClass( 'active' );
						multi.addClass( 'active' );
					}
					else {
						multi.removeClass( 'active' );
						single.addClass( 'active' );
					}
				});
				el.find( '.submit' ).on( 'click', function() {
					var d = {
						mail_settings: {
							auth: {},
						},
					};
					el.find( 'td.value > .active input,select' ).each( function() {
						var k = $(this).attr( 'name' );
						var v = $(this).val();
						var pos = k.indexOf( '[' );
						if ( k == 'user' || k == 'pass' )
							d.mail_settings.auth[ k ] = v;
						else if ( k == 'service' )
							return true;
						else if ( pos >= 0 ) {
							var lang = k.substring( pos + 1, pos + 3 );
							k = k.substring( 0, pos );
							if ( !d[ k ] )
								d[ k ] = {};
							d[ k ][ lang ] = v;
						}
						else
							d[ k ] = v;
					});
					var submit = $(this);
					submit.hide();
					$.post( '/admin/savesettings', {
						data: JSON.stringify( d ),
					}, function( ret ) {
						if ( ret == 'OK' ) {
							submit.addClass( 'disabled' ).attr( 'disabled', true ).show();
						}
						else
							alert( 'error!' );
					});
				});
			},
			disable: function( el, data ) {
				el.find( '.submit' ).off( 'click' );
			},
		},
			
		pageedit: {

			control_mouseover : function( control, el ) {
				var css = {
					top: el.offset().top + 'px',
				}
				if ( control.hasClass( 'left' ) )
					css.left = el.offset().left + 'px';
				else
					css.left = el.outerWidth() - control.outerWidth() + el.offset().left + 'px';
				control
					.css( css )
					.show()
				;
			},
			control_mouseout : function( control, e ) {
				if ( e.relatedTarget ) {
					var target = $( e.relatedTarget );
					
					if (
						/*target.hasClass( 'object' ) ||
						target.closest( '.object' ).length > 0 ||
						target.hasClass( 'objecttemplate' ) ||
						target.closest( '.objecttemplate' ).length > 0 ||*/
						target.closest( '.controls' ).length > 0
					)
						return false;
				}
				control
					.hide()
				;
				return true;
			},
			
			collection_control : null,
			collection_current_collection : null,
			collection_current_object : null,
			collection_mouseover : function( that, el, e ) {
				if ( el.hasClass( 'objecttemplate' ) ) {
					that.collection_control.find( '.add' ).show();
					that.collection_control.find( '.delete' ).hide();
				}
				else {
					that.collection_control.find( '.delete' ).show();
					that.collection_control.find( '.add' ).hide();
				}
				
				that.control_mouseover( that.collection_control, el );
				
				that.collection_current_object = el;
				that.collection_current_collection = el.closest( '.collection' );
			},
			collection_mouseout : function( that, el, e ) {
				if ( that.control_mouseout( that.collection_control, e ) ) {
					that.collection_current_collection = null;
					that.collection_current_object = null;
				}
			},
			img_control : null,
			section_control : null,
			
			init_control : function( control ) {
				var that = this;
				control.on( 'mouseout', function( e ) {
					that.control_mouseout( control, e );
				});
			},
			
			construct: function() {
				var that = this;
				
				this.collection_control = $( '.admin-panel .controls .collection' );
				this.img_control = $( '.admin-panel .controls .img' );
				this.section_control = $( '.admin-panel .controls .section' );

				this.init_control( this.collection_control );
				this.init_control( this.img_control );
				this.init_control( this.section_control );
				
				$( 'button' ).on( 'click', function() {
					return $(this).find( '[contenteditable="true"]' ).length <= 0;
				});
				
				this.collection_control.find( '> .add' ).on( 'click', function() {
					if ( that.collection_current_object ) {
						
						// find free id
						var ids = [];
						that.collection_current_collection.find( '.object' ).each( function() {
							ids.push( +$(this).attr( 'data-id' ) );
						});
						
						var newid = 1;
						ids.forEach( id => {
							if ( newid <= id )
								newid = id + 1;
						});
						console.log( newid );
						
						var objectuid = that.collection_current_collection.attr( 'data-collectiontype' ) + '_' + newid;
						var object = that.collection_current_object
							.clone()
							.removeClass( 'objecttemplate' )
							.addClass( 'object' )
							.attr( 'data-id', newid )
						;
						
						var templateuid = 'TEMPLATE';
						object.find( '.editable[data-type="html"]' ).each( function() {
							var data = JSON.parse( $(this).attr( 'data-data' ) );
							data.msgid = data.msgid.replace( templateuid, objectuid );
							data.text = data.msgid;
							$(this)
								.html( data.text )
								.attr( 'data-data', JSON.stringify( data ) )
							;
							that.init( $(this), data );
							that.enable( $(this), data );
						});
						object.find( '.editable[data-type="img"]' ).each( function() {
							var data = JSON.parse( $(this).attr( 'data-data' ) );
							data.imgid = data.imgid.replace( templateuid, objectuid );
							$(this).attr( 'data-data', JSON.stringify( data ) );
							that.init( $(this), data );
							that.enable( $(this), data );
						});
						
						set_unsaved( that.collection_current_collection );
						object.insertBefore( that.collection_current_object );
						that.collection_control.hide();
					}
				});
				
				this.collection_control.find( '> .delete' ).on( 'click', function() {
					if ( that.collection_current_object ) {
						set_unsaved( that.collection_current_collection );
						that.collection_current_object.remove();
						that.collection_control.hide();
					}
				});
				
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
						el.html( htmlDecode( data.text ) );
						break;
					}
					case 'placeholder': {
						el.attr( 'placeholder', data.text );
						break;
					}
					case 'collection': {
						// nothing to do
						break;
					}
					case 'img': {
						el
							.addClass( 'imageblock' )
							.addClass( 'img' )
							.addClass( data.cls )
							.attr( 'data-imgid', data.imgid )
							.css({
								width: data.width + 'px',
								'max-height': data.height + 'px',
							})
						;
						break;
					}
					case 'section': {
						var control = this.section_control.clone();
						control.attr( 'class', 'control' );
						control.find( '.name' ).html( data.section );
						control.find( 'input' ).each( function() {
							var k = $(this).attr( 'name' );
							if ( data[ k ] )
								$(this).attr( 'checked', true );
						});
						var switch_order = function( first, second ) {
							var dt1 = JSON.parse( first.attr( 'data-data' ) );
							var dt2 = JSON.parse( second.attr( 'data-data' ) );
							first.insertAfter( second );
							$( 'ul.nav > li[data-menu="' + dt1.section + '"]').insertAfter( 'ul.nav > li[data-menu="' + dt2.section + '"]' );
							$( 'ul.footermenu > li[data-menu="' + dt1.section + '"]').insertAfter( 'ul.footermenu > li[data-menu="' + dt2.section + '"]' );
							var o = dt1.order;
							dt1.order = dt2.order;
							dt2.order = o;
							first.attr( 'data-data', JSON.stringify( dt1 ) );
							second.attr( 'data-data', JSON.stringify( dt2 ) );
							set_unsaved( first );
							set_unsaved( second );
						}
						control.find( '.move.up' ).on( 'click', function() {
							var section = $(this).closest( '.section' );
							var prev = section.prev( '.section' );
							if ( prev.length > 0 ) {
								switch_order( prev, section );
								$( 'body' ).scrollTop( $( 'body' ).scrollTop() );
							}
						});
						control.find( '.move.down' ).on( 'click', function() {
							var section = $(this).closest( '.section' );
							var next = section.next( '.section' );
							if ( next.length > 0 ) {
								switch_order( section, next );
								$( 'body' ).scrollTop( $( 'body' ).scrollTop() + next.outerHeight() + 28 );
							}
						});
						var showinmenuinput = control.find( 'input[name="show_in_menu"]');
						var showinfooterinput = control.find( 'input[name="show_in_footer"]');
						var enabledinput = control.find( 'input[name="enabled"]' );
						
						var showhideinmenu = function() {
							var menu = $( 'ul.nav > li[data-menu="' + data.section + '"]');
							if ( enabledinput.is( ':checked' ) && showinmenuinput.is( ':checked' ) )
								menu.removeClass( 'disabled' );
							else
								menu.addClass( 'disabled' );
						}
						var showhideinfooter = function() {
							var menu = $( 'ul.footermenu > li[data-menu="' + data.section + '"]');
							if ( enabledinput.is( ':checked' ) && showinfooterinput.is( ':checked' ) )
								menu.removeClass( 'disabled' );
							else
								menu.addClass( 'disabled' );
						}
						enabledinput.on( 'change', function() {
							var section = $(this).closest( '.section' );
							if ( $(this).is( ':checked' ) )
								section.removeClass( 'disabled' );
							else
								section.addClass( 'disabled' );
							showhideinmenu();
							showhideinfooter();
						});
						showinmenuinput.on( 'change', showhideinmenu );
						showinfooterinput.on( 'change', showhideinfooter );
						control.prependTo( el );
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
						if ( el.closest( '.objecttemplate' ).length == 0 )
							el.attr( 'contenteditable', true );
						break;
					}
					case 'placeholder': {
						el.val( el.attr( 'placeholder' ) );
						break;
					}
					case 'collection': {
						var that = this;
						el.on( 'mouseover', '.object,.objecttemplate', function( e ) {
							that.collection_mouseover( that, $(this), e );
						});
						el.on( 'mouseout', '.object,.objecttemplate', function( e ) {
							that.collection_mouseout( that, $(this), e );
						});
						var template = el.find( '.objecttemplate' );
						if ( template.prop( 'tagName' ) == 'LI' )
							template.css( 'display', 'inline-block' );
						else
							template.show();
						break;
					}
					case 'img': {
						var that = this;
						el.on( 'mouseover', function( e ) {
							if ( !$(this).closest( '.objecttemplate' ).length ) {
								that.img_control.find( 'form' ).attr( 'data-imgid', data.imgid );
								that.img_control.find( '.size' ).html( data.width + 'x' + data.height );
								that.control_mouseover( that.img_control, el );
							}
						});
						el.on( 'mouseout', function( e ) {
							that.control_mouseout( that.img_control, e );
						});
						$( '.imageblock' ).addClass( 'enabled' );
						break;
					}
					case 'section': {
						el.addClass( 'editing' );
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
						if ( el.closest( '.objecttemplate' ).length == 0 )
							el.attr( 'contenteditable', false );
						break;
					}
					case 'placeholder': {
						el.attr( 'placeholder', el.val() );
						el.val( '' );
						break;
					}
					case 'collection': {
						el.find( '.objecttemplate' ).hide();
						el.off( 'mouseover', '.object,.objecttemplate' );
						el.off( 'mouseout', '.object,.objecttemplate' );
						break;
					}
					case 'img': {
						el.off( 'mouseover');
						el.off( 'mouseout');
						$( '.imageblock' ).removeClass( 'enabled' );
						break;
					}
					case 'section': {
						el.removeClass( 'editing' );
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
					case 'collection': {
						data.new_ids = [];
						el.find( '.object' ).each( function() {
							data.new_ids.push( +$(this).attr( 'data-id' ) );
						});
						break;
					}
					case 'img': {
						// nothing to do, already saved
						break;
					}
					case 'section': {
						var control = el.find( '.control' );
						control.find( 'input' ).each( function() {
							data[ $(this).attr( 'name' ) ] = +$(this).is( ':checked' );
						});
						break;
					}
					default: {
						console.log( datatype + '???' );
					}
				}
				
			},
		},
	
	}
	
	var showerror = err => {
		errlbl.stop( true ).html( err ).css( 'opacity', 1 ).show().fadeOut( 5000 );
	};
	
	savebtn.on( 'click', function() {
		if ( !$(this).hasClass( 'disabled' ) && !$(this).hasClass( 'loading' ) ) {
			
			var request = {
				language: global.language,
				data: [],
			};
			
			var unsaved = $( '.editable.unsaved' );
			
			unsaved.each( function() {
				var data = JSON.parse( $(this).attr( 'data-data' ) );
				tools[ data.tool ].save( $(this), data );
				request.data.push( data );
			});
			
			savebtn.addClass( 'loading' );
			$.post( '/admin/save', {
				data: JSON.stringify( request ),
			}, function( ret ) {
				savebtn.removeClass( 'loading' );
				if ( ret == 'OK' ) {
					unsaved.each( function() {
						$(this).removeClass( 'unsaved' );
					});
					savebtn.addClass( 'disabled' );
				}
				else {
					console.log( ret );
					showerror( 'Error' );
				}
			}).fail( function( err ) {
				savebtn.removeClass( 'loading' );
				console.log( err );
				showerror( 'Error' );
			});
		}
	});
	
	var settool = function( tool ) {
		$( '.editable' ).each( function() {
			var data;
			if ( $(this).attr( 'data-tool' ) )
				data = {
					tool: $(this).attr( 'data-tool' )
				};
			else
				data = JSON.parse( $(this).attr( 'data-data' ) );
			
			if ( $(this).hasClass( 'active' ) && data.tool != tool ) {
				tools[ data.tool ].disable( $(this), data );
				$(this).removeClass( 'active' );
			}
			if ( tool && !$(this).hasClass( 'active' ) && data.tool == tool ) {
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
			if ( source ) {
				var pos = source.indexOf( '!@#' );
				var badpos1 = source.indexOf( '<' );
				var badpos2 = source.indexOf( '>' );
				if (
					pos >= 0 &&
					( badpos1 < 0 || pos < badpos1 ) &&
					( badpos2 < 0 || pos < badpos2 )
				) {
					var rawdata = source.substring( pos + 3 );
					var data = null;
					try {
						data = JSON.parse( rawdata );
					} catch ( e ) {
						console.log( 'parse error', rawdata );
					}
					if ( data ) {
						el
							.addClass( 'editable' )
							.addClass( data.tool )
							.attr( 'data-type', type )
							.attr( 'data-data', rawdata )
						;
						tools[ data.tool ].init( el, data );
					}
					else {
						el
							.html( '' );
						;
					}
					return true;
				}
			}
			return false;
		}
		
		trysource( el.html(), 'html' ) ||
		trysource( el.attr( 'placeholder' ), 'placeholder' ) ||
		trysource( el.attr( 'data-collection' ), 'collection' ) ||
		trysource( el.attr( 'data-img' ), 'img' ) ||
		trysource( el.attr( 'data-section' ), 'section' )
	});
	
});
