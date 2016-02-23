/*
	slidebutton - 2.0.0
	https://github.com/jquery-element/slidebutton
*/

(function() {

function updateChecked( that ) {
	var chk = typeof that.attr.checked === "string";
	that.jqElement.toggleClass( "slidebutton-checked", chk );
	that.attr.checked = chk && "checked";
	that.jqCheckbox[ 0 ].checked = chk;
}

$.element( {
	name: "slidebutton",
	attributes: {
		filter: [ "checked" ],
		callback: function( name, val, oldval ) {
			if ( val !== oldval ) {
				updateChecked( this );
			}
		}
	},
	htmlReplace:
		'<div class="slidebutton">'+
			'{{html}}'+
			'<div class="slidebutton-track">'+
				'<div class="slidebutton-on"></div>'+
			'</div>'+
			'<span class="slidebutton-thumb"></span>'+
		'</div>'
	,
	init: function() {
		var that = this;

		this.jqOn = this.jqElement.find( ".slidebutton-on" );
		this.jqThumb = this.jqElement.children( ".slidebutton-thumb" );
		this.jqCheckbox = this.jqElement.children( "input" );
		this.okBlur = true;
		this.focused = false;

		updateChecked( this );

		this.jqCheckbox
			.focus( function() {
				if ( !that.focused ) {
					that.focused = true;
					that.jqElement.addClass( "slidebutton-focus" );
				}
			})
			.blur( function() {
				if ( that.okBlur ) {
					that.focused = false;
					that.jqElement.removeClass( "slidebutton-focus" );
				} else {
					that.okBlur = true;
					that.jqCheckbox.focus();
				}
			})
		;

		this.jqElement
			.mousedown( function() {
				that.okBlur = false;
				that.jqCheckbox.focus();
			})
			.click( function() {
				that.jqCheckbox
					.focus()
					.attr( "checked", that.attr.checked ? null : "" )
				;
			})
		;
	},
	css: '\
		.slidebutton input {\
			position: absolute;\
			top: -999999px;\
			opacity: .5;\
		}\
		.slidebutton {\
			display: inline-block;\
			position: relative;\
			width: 1.5em;\
			height: .7em;\
			cursor: pointer;\
			-webkit-touch-callout: none;\
			-webkit-user-select: none;\
			   -moz-user-select: none;\
			    -ms-user-select: none;\
			        user-select: none;\
		}\
		.slidebutton-track {\
			position: relative;\
			overflow: hidden;\
			box-sizing: border-box;\
			height: 100%;\
			border-radius: 999999px;\
			background-color: rgba( 0, 0, 0, .5 );\
		}\
		.slidebutton-focus .slidebutton-track {\
			border: .1em solid rgba( 255, 255, 255, .4 );\
		}\
		.slidebutton-on {\
			width: .35em;\
			height: 100%;\
			background: #f33;\
		}\
		.slidebutton-checked .slidebutton-on {\
			width: 100%;\
			margin-left: -.35em;\
		}\
		.slidebutton-thumb {\
			position: absolute;\
			width: .7em;\
			height: 100%;\
			top: 0;\
			left: 0;\
			margin-left: -1px;\
			border-radius: 50%;\
			background: #fff;\
		}\
		.slidebutton-checked .slidebutton-thumb {\
			left: 100%;\
			margin-left: -.7em;\
		}\
		.slidebutton-on,\
		.slidebutton-thumb {\
			transition: all .2s;\
		}\
	'
});

})();
