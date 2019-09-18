// Copyright 2019, University of Colorado Boulder

/**
 * A Node that will catch input within the shape of the body in john-travoltage. The background of the
 * screen view is explicitly non-pickable so this node will catch input on top of it.
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const Path = require( 'SCENERY/nodes/Path' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );

  class BodyShapeNode extends Path {

    /**
     * @param {LineSegment[]} bodyLines - array of LineSegments that define the shape of the body.
     */
    constructor( model, options ) {
      super( model.bodyShape );

      // determines if the pointer is within the body area - this is all about making it easier to understand
      // the shape of the body, so we use DragListener for its touchSnag support so the body is discoverable
      this.addInputListener( new DragListener( {

        // just for vibration feedback, don't make the cursor look different
        pressCursor: null,

        press: ( event, listener ) => {
          model.touchingBodyProperty.set( true );
        },
        drag: ( event, listener ) => {
          const parentPoint = this.globalToParentPoint( event.pointer.point );
          model.touchingBodyProperty.set( model.bodyContainsPoint( parentPoint ) );
        },
        release: ( event, listener ) => {
          model.touchingBodyProperty.set( false );
        }
      } ) );
    }

    /**
     * Make the body shape visible. This is purely for debugging purposes.
     */
    showBody() {
      this.setStroke( 'green' );
    }
  }

  return johnTravoltage.register( 'BodyShapeNode', BodyShapeNode );
} );
