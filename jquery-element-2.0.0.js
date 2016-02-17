/*
	jquery-element - 2.0.0
	https://github.com/Mr21/jquery-element
*/

(function( $ ) {

"use strict";

var
	// Because we can't call `arguments.slice()`
	arraySlice = [].slice,
	list_elemName = {}
;

if ( MutationObserver = MutationObserver || WebKitMutationObserver ) {
	new MutationObserver( function( mutations ) {
		var i = 0, j, m, el, obj;
		while ( m = mutations[ i++ ] ) {
			for ( j = 0; el = m.addedNodes[ j++ ]; ) {
				obj = el.nodeType === 1 && el.dataset.jqueryElement;
				if ( obj = obj && list_elemName[ obj ] ) {
					initElement( obj, el );
				}
			}
		}
	}).observe( document, {
		subtree: true,
		childList: true
	});
}

function initElement( obj, el ) {
	var
		html,
		elementObject,
		elNextNode,
		jqHtml,
		jqNestedParent,
		jqElementParent,
		jqElementNext,
		jqElement = $( el ),
		containerClasses = el.dataset.jqueryElementClass
	;

	// Remove the data-jquery-element attribute to not re-initialize it
	// when the element is detach and reattach to the DOM again.
	delete el.dataset.jqueryElement;
	delete el.dataset.jqueryElementClass;

	// if there is some HTML to include inside the jqElement.
	if ( html = obj.html ) {
		jqElement.html( html );
	}

	// If there is some HTML to replace the jqElement.
	if ( html = obj.htmlReplace ) {

		// Creation of the content.
		jqHtml = $( html );

		// If the jqElement will NOT be inside this new content...
		if ( html.indexOf( "{{html}}" ) < 0 ) {

			// ...we delete it by .replaceAll.
			jqElement = jqHtml.replaceAll( el );
		} else {

			// Searching the element who are containing the textNode "{{html}}" inside.
			jqNestedParent = jqHtml.find( ":contains('{{html}}'):last" );
			if ( !jqNestedParent.length ) {
				jqNestedParent = jqHtml;
			}

			jqElementParent = jqElement.parent();
			jqElementNext = jqElement.next();

			// Find the textNode...
			elNextNode = jqNestedParent[ 0 ].firstChild;
			for ( ; elNextNode; elNextNode = elNextNode.nextSibling ) {
				if ( elNextNode.nodeType === 3 && // Node.TEXT_NODE = 3
					elNextNode.textContent.indexOf( "{{html}}" ) >= 0
				) {

					// ...to be deleted and replaced by the jqElement.
					jqElement.replaceAll( elNextNode );
					break;
				}
			}

			// Now, all the content (with the jqElement inside)
			// will take the old position in the DOM of jqElement.
			jqElement = jqHtml;
			if ( jqElementNext.length ) {
				jqElement.insertBefore( jqElementNext );
			} else {
				jqElement.appendTo( jqElementParent );
			}
		}
	}

	// Add the classes inside the [data-jquery-element-class] on the container.
	jqElement.addClass( containerClasses );

	// Extend the `this` Object with all the methodes of the `prototype:` object.
	el.jqueryElementObject =
	jqElement[ 0 ].jqueryElementObject =
	elementObject = $.extend( {
		jqElement: jqElement
	}, obj.prototype );

	// Add a mutationObserver to the object for the attributes's list.
	watchAttr(
		elementObject,
		el.parentNode ? el : jqElement[ 0 ],
		obj.attributes
	);

	// Call the element's constructor: the `init:` function.
	if ( obj.init ) {
		obj.init.call( elementObject );
	}
}

function watchAttr( obj, node, attributes ) {
	var i, fn, attr, name, mut, observe, filter;

	obj.attr = attr = {};

	if ( MutationObserver && attributes ) {
		fn = attributes.callback;

		observe = {
			attributes: true,
			attributeOldValue: true
		};

		// If we have a filter attribute, we'll use the mutation's attribute: attributeFilter.
		filter = attributes.filter;
		if ( filter && filter.length ) {
			observe.attributeFilter = filter;
			// Fill all the `attr` array before any mutation.
			for ( i = 0; name = filter[ i++ ]; ) {
				attr[ name ] = node.getAttribute( name );
			}
		}

		obj.mutationObs = new MutationObserver( function( mutations ) {
			for ( i = 0; mut = mutations[ i++ ]; ) {
				name = mut.attributeName;
				attr[ name ] = node.getAttribute( name );
			}
			if ( fn ) {
				for ( i = 0; mut = mutations[ i++ ]; ) {
					name = mut.attributeName;
					fn.call( obj, name, attr[ name ], mut.oldValue );
				}
			}
		}).observe( node, observe );
	}
}

$.element = function( obj ) {

	// We add a new entry for all the future elements with the name: `obj.name`.
	// `list_elemName` is use in the MutationObserver.
	list_elemName[ obj.name ] = obj;

	// Set the CSS only one time directly in the <head>.
	if ( obj.css ) {
		obj.style = $( "<style>" )
			.html( obj.css )
			.appendTo( "head" )
		;
	}

	// Initialize all the jquery-elements ASAP, knowing that the JS files
	// can be included in the <head> or at the end of the <body>.
	function init() {
		$( "[data-jquery-element='" + obj.name + "']" ).each( function() {
			initElement( obj, this );
		});
	}
	init();
	$( init );
};

$.element.version = "2.0.0";

$.fn.element = function( fnName ) {

	// Return directly the jqueryElementObject for this kind of code:
	// var value = $( "#thisOne" ).element().getValue();
	if ( !arguments.length ) {
		return this[ 0 ] && this[ 0 ].jqueryElementObject;
	}

	// Removing the name's methode of the arguments list.
	var args = arraySlice.call( arguments, 1 );

	// The `fn` methode will be called to each jquery-element, example of use:
	// $( ".allTheseOnes" ).element( "methode", argA, argB, ... );
	return this.each( function() {
		var
			proto = this.jqueryElementObject,
			fn = proto && proto[ fnName ]
		;
		if ( fn ) {
			fn.apply( proto, args );
		}
	});
};

})( jQuery );
