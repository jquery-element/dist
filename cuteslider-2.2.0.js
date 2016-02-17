/*
	cuteslider - 2.2.0
	https://github.com/jquery-element/cuteslider
*/

(function() {

var
	curSlider,
	jqBody
;

function mouseup() {
	if ( curSlider ) {
		curSlider.jqElement.removeClass( "focus" );
		jqBody.removeClass( "user-select-none" );
		curSlider = null;
	}
}

$(function() {
	jqBody = $( document.body );

	$( window ).blur( mouseup );

	$( document )
		.mouseup( mouseup )
		.mousemove( function( e ) {
			if ( curSlider ) {
				moveThumb( curSlider, e );
			}
		})
	;
});

function updateCSS( that ) {
	var prc =
		( that.attr.value - that.attr.min ) /
		( that.attr.max   - that.attr.min ) * 100 + "%";
	that.jqThumb     .css( that.isVertical ? "bottom" : "left" , prc );
	that.jqTrackLower.css( that.isVertical ? "height" : "width", prc );
}

function verticalToggle( that, b ) {
	that.isVertical = b;
	that.jqElement
		.removeClass( "cuteslider-vertical cuteslider-horizontal" )
		.addClass( b ? "cuteslider-vertical" : "cuteslider-horizontal" )
	;
}

function setVal( that, v ) {
	that.elRng.value = v || 0;
	v = +that.elRng.value;
	if ( that.attr.value !== v ) {
		that.attr.value = v;
		updateCSS( that );
	}
	return v;
}

function moveThumb( that, event ) {
	var
		val,
		trackSize,
		os = that.jqTrack.offset(),
		min = +that.attr.min,
		max = +that.attr.max,
		oldValue = +that.attr.value,
		step = that.attr.step / 4
	;

	if ( that.isVertical ) {
		trackSize = that.jqTrack.height();
		val = trackSize - event.pageY + os.top;
	} else {
		trackSize = that.jqTrack.width();
		val = event.pageX - os.left;
	}

	val = setVal( that, min + val / trackSize * ( max - min ) );
	if ( val < oldValue - step || val > oldValue + step ) {
		that.jqRng.change();
	}
}

jQuery.element({
	name: "cuteslider",
	css: "\
		.user-select-none {\
			-webkit-user-select: none;\
			   -moz-user-select: none;\
			    -ms-user-select: none;\
			        user-select: none;\
		}\
		.cuteslider {\
			display: inline-block;\
			position: relative;\
			cursor: pointer;\
		}\
		.cuteslider input {\
			display: none;\
		}\
		.cuteslider-track {\
			position: absolute;\
			overflow: hidden;\
			border-radius: 2px;\
			background: #888;\
		}\
		.cuteslider-horizontal .cuteslider-track {\
			width: 100%;\
			top: 50%;\
			height: 4px;\
			margin-top: -2px;\
		}\
		.cuteslider-vertical .cuteslider-track {\
			width: 4px;\
			height: 100%;\
			left: 50%;\
			margin-left: -2px;\
		}\
		.cuteslider-track-lower,\
		.cuteslider-thumb {\
			background: #f33;\
		}\
		.cuteslider-horizontal .cuteslider-track-lower {\
			width: 0;\
			height: 100% !important;\
		}\
		.cuteslider-vertical .cuteslider-track-lower {\
			position: absolute;\
			bottom: 0;\
			width: 100% !important;\
		}\
		.cuteslider-thumb {\
			position: absolute;\
			width: 14px;\
			height: 14px;\
			border-radius: 50%;\
		}\
		.cuteslider-horizontal .cuteslider-thumb {\
			left: 0;\
			top: 50%;\
			bottom: auto !important;\
			margin: -7px 0 0 -7px;\
		}\
		.cuteslider-vertical .cuteslider-thumb {\
			left: 50% !important;\
			bottom: 0;\
			margin: 0 0 -7px -7px;\
		}\
	",
	htmlReplace:
		"<div class='cuteslider'>"+
			"{{html}}"+
			"<div class='cuteslider-track'>"+
				"<div class='cuteslider-track-lower'></div>"+
			"</div>"+
			"<div class='cuteslider-thumb'></div>"+
		"</div>"
	,
	init: function() {
		var
			that = this,
			jqEl = this.jqElement
		;

		this.jqTrack = $( ".cuteslider-track", jqEl );
		this.jqTrackLower = $( ".cuteslider-track-lower", this.jqTrack );
		this.jqThumb = $( ".cuteslider-thumb", jqEl );
		this.jqRng = $( "input", jqEl ),
		this.elRng = this.jqRng[ 0 ];

		verticalToggle( this, this.attr[ "data-cuteslider-vertical" ] != null );
		setVal( this, this.attr.value );
		updateCSS( that );

		jqEl.mousedown( function( e ) {
			if ( e.button === 0 ) {
				curSlider = that;
				jqBody.addClass( "user-select-none" );
				jqEl.addClass( "focus" );
				moveThumb( that, e );
			}
		});
	},
	attributes: {
		filter: [ "min", "max", "step", "value", "data-cuteslider-vertical" ],
		callback: function( key, val, oldval ) {
			if ( key === "data-cuteslider-vertical" ) {
				verticalToggle( this, val !== null );
			}
			updateCSS( this );
		}
	},
	prototype: {
		val: function( v ) {
			if ( !arguments.length ) {
				return +this.attr.value;
			}
			if ( !curSlider ) {
				setVal( this, v );
			}
		}
	}
});

})();
