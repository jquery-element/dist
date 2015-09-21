/*
	cuteSlider - 1.0.0
	https://github.com/jquery-element/cuteSlider
*/

(function() {

var curSlider;

function mouseup() {
	if ( curSlider ) {
		curSlider.jqElement.removeClass( "focus" );
		curSlider = null;
	}
}

$( window ).blur( mouseup );

$( document )
	.mouseup( mouseup )
	.mousemove( function( e ) {
		if ( curSlider ) {
			curSlider._moveThumb( e.pageX );
		}
	})
;

jQuery.element({
	name: "cuteSlider",
	css: "\
		.cuteSlider {\
			display: inline-block;\
			position: relative;\
			cursor: pointer;\
			-webkit-user-select: none;\
			   -moz-user-select: none;\
			    -ms-user-select: none;\
			        user-select: none;\
		}\
		.cuteSlider input {\
			display: none;\
		}\
		.cuteSlider-track {\
			position: absolute;\
			overflow: hidden;\
			width: 100%;\
			top: 50%;\
			height: 4px;\
			margin-top: -2px;\
			border-radius: 2px;\
			background: #888;\
		}\
		.cuteSlider-track-lower,\
		.cuteSlider-thumb {\
			background: #f33;\
		}\
		.cuteSlider-track-lower {\
			width: 0;\
			height: 100%;\
		}\
		.cuteSlider-thumb {\
			position: absolute;\
			left: 0;\
			top: 50%;\
			width: 14px;\
			height: 14px;\
			margin: -7px 0 0 -7px;\
			border-radius: 50%;\
		}\
	",
	htmlReplace: '\
		<div class="cuteSlider">\
			{{html}}\
			<div class="cuteSlider-track">\
				<div class="cuteSlider-track-lower"></div>\
			</div>\
			<div class="cuteSlider-thumb"></div>\
		</div>\
	',
	init: function() {
		var
			that = this,
			jqEl = this.jqElement
		;

		this.elContainer = jqEl[ 0 ],
		this.jqTrack = $( ".cuteSlider-track", jqEl );
		this.jqTrackLower = $( ".cuteSlider-track-lower", this.jqTrack );
		this.jqThumb = $( ".cuteSlider-thumb", jqEl );
		this.jqRng = $( "input", jqEl ),
		this.elRng = this.jqRng[ 0 ];

		this.elContainer.value = 0;
		this._setVal( this.elRng.value );

		jqEl
			.mousedown( function( e ) {
				if ( e.button === 0 ) {
					curSlider = that;
					jqEl.addClass( "focus" );
					that._moveThumb( e.pageX );
				}
			})
		;
	},
	prototype: {

		// public:
		val: function( v ) {
			if ( !arguments.length ) {
				return this.elContainer.value;
			}
			this._setVal( v );
		},

		// private:
		_setVal: function( v ) {
			var
				vPerc,
				r = this.elRng
			;
			r.value = v;
			v = r.value;
			vPerc = ( ( v - r.min ) / ( r.max - r.min ) ) * 100 + "%";
			this.jqThumb.css( "left", vPerc );
			this.jqTrackLower.css( "width", vPerc );
			if ( Math.abs( this.elContainer.value - v ) >= r.step / 2 ) {
				this.elContainer.value = v;
				this.jqRng.change();
			}
		},
		_moveThumb: function( mouseX ) {
			var
				trackX = this.jqTrack.offset().left,
				trackW = this.jqTrack.width(),
				x = ( mouseX - trackX ) / trackW,
				rng = this.elRng,
				min = +rng.min
			;
			this._setVal( min + x * ( rng.max - min ) );
		}
	}
});

})();
