/*
	slidebutton - 1.1.0
	https://github.com/jquery-element/slidebutton
*/

$.element( {
	name: "slidebutton",
	htmlReplace:
		'<div class="slidebutton">'+
			'{{html}}'+
			'<div class="slidebutton-track">'+
				'<div class="slidebutton-on"></div>'+
			'</div>'+
			'<span class="slidebutton-thumb"></span>'+
		'</div>'
	,
	css: '\
		.slidebutton input {\
			display: none;\
		}\
		.slidebutton {\
			display: inline-block;\
			position: relative;\
			min-width: 20px;\
			min-height: 10px;\
			cursor: pointer;\
			-webkit-touch-callout: none;\
			-webkit-user-select: none;\
			   -moz-user-select: none;\
			    -ms-user-select: none;\
			        user-select: none;\
		}\
		.slidebutton-track {\
			overflow: hidden;\
			height: 100%;\
			border-radius: 9999px;\
			background-color: rgba( 0, 0, 0, .5 );\
		}\
		.slidebutton-on {\
			width: 0;\
			height: 100%;\
			background: #f33;\
		}\
		.slidebutton-thumb {\
			position: absolute;\
			height: 100%;\
			top: 0;\
			left: 0;\
			margin-left: -1px;\
			border-radius: 50%;\
			background: #fff;\
		}\
		.slidebutton-active .slidebutton-thumb {\
			margin-left: 1px;\
		}\
		.slidebutton-on,\
		.slidebutton-thumb {\
			transition: all .2s;\
		}\
	',
	init: function() {
		var
			jqElement = this.jqElement,
			jqThumb = jqElement.children( ".slidebutton-thumb" ),
			jqOn = jqElement.find( ".slidebutton-on" ),
			thumbH = jqThumb.height(),

			jqCheckbox = jqElement.children( "input" ),
			mutation = new MutationObserver( update )
				.observe( jqCheckbox[ 0 ], {
					attributes: true,
					attributeFilter: [ "checked" ]
				})
		;

		jqThumb.css( "width", thumbH );
		jqOn.css( "width", thumbH / 2 );

		function isChecked() {
			return typeof jqCheckbox.attr( "checked" ) === "string";
		}

		function update() {
			var
				elemW,
				thumbH = jqThumb.height(),
				checked = isChecked()
			;
			if ( checked ) {
				elemW = jqElement.width();
				jqOn.css( "width", elemW - thumbH / 2 );
				jqThumb.css( "left", elemW - thumbH );
			} else {
				jqOn.css( "width", thumbH / 2 );
				jqThumb.css( "left", 0 );
			}
			jqElement.toggleClass( "slidebutton-active", checked );
		}

		jqElement.click( function() {
			jqCheckbox.attr( "checked", isChecked() ? null : "checked" );
		});

		update();
	}
});
