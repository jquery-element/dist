/*
	cuteslider - 2.1.0
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
				curSlider._moveThumb( curSlider.isVertical ? e.pageY : e.pageX );
			}
		})
	;
});

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
		.cuteslider-track-lower {\
			border-radius: inherit;\
		}\
		.cuteslider-horizontal .cuteslider-track-lower {\
			width: 0;\
			height: 100%;\
		}\
		.cuteslider-vertical .cuteslider-track-lower {\
			position: absolute;\
			bottom: 0;\
			width: 100%;\
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
			margin: -7px 0 0 -7px;\
		}\
		.cuteslider-vertical .cuteslider-thumb {\
			left: 50%;\
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

		this.elContainer = jqEl[ 0 ],
		this.jqTrack = $( ".cuteslider-track", jqEl );
		this.jqTrackLower = $( ".cuteslider-track-lower", this.jqTrack );
		this.jqThumb = $( ".cuteslider-thumb", jqEl );
		this.jqRng = $( "input", jqEl ),
		this.elRng = this.jqRng[ 0 ];

		this.isVertical = this.elRng.dataset.cutesliderVertical != null;
		jqEl.addClass( this.isVertical ? "cuteslider-vertical" : "cuteslider-horizontal" );
		this._setVal( this.elRng.value );

		jqEl
			.mousedown( function( e ) {
				if ( e.button === 0 ) {
					curSlider = that;
					jqBody.addClass( "user-select-none" );
					jqEl.addClass( "focus" );
					that._moveThumb( that.isVertical ? e.pageY : e.pageX );
				}
			})
			.on( "wheel", function( e ) {
				var
					r = that.elRng,
					step = e.originalEvent.deltaY < 0 ? +r.step : -r.step
				;

				that._setVal( +r.value + step );
				that.jqRng.change();
			})
		;
	},
	prototype: {

		// public:
		val: function( v ) {
			if ( !arguments.length ) {
				return this.elContainer.value;
			}
			if ( !curSlider ) {
				this._setVal( v );
			}
		},

		// private:
		_setVal: function( v ) {
			var
				vPerc,
				r = this.elRng
			;

			r.value = v || 0;
			v = +r.value;
			if ( this.elContainer.value !== v ) {
				vPerc = ( ( v - r.min ) / ( r.max - r.min ) ) * 100 + "%";
				this.jqThumb.css( this.isVertical ? "bottom" : "left", vPerc );
				this.jqTrackLower.css( this.isVertical ? "height" : "width", vPerc );
				this.elContainer.value = v;
			}
		},
		_moveThumb: function( mouse ) {
			var
				rng = this.elRng,
				min = +rng.min,
				oldValue = +rng.value,
				step = rng.step / 4,
				track = this.jqTrack,
				os = track.offset(),
				val = mouse - ( this.isVertical ? os.top : os.left ),
				trackSize = this.isVertical ? track.height() : track.width()
			;

			if ( this.isVertical ) {
				val = trackSize - val;
			}
			val = min + val / trackSize * ( rng.max - min );
			this._setVal( val );
			val = +rng.value;
			if ( val < oldValue - step || val > oldValue + step ) {
				this.jqRng.change();
			}
		}
	}
});

})();
