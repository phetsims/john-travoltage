// Copyright 2019, University of Colorado Boulder

/**
 * A node that can be used to detect pointer interaction over a set of shapes. You can add a shape with addShape, which
 * takes a Shape and a Property. While the pointer is down over the shape, the associated Property will be set to true.
 * This can be used to script unique behavior while the Property is over the given shape.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );

  class ShapeHitDetector extends Node {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      super();

      this.paths = [];

      // determines if the pointer is within the body area - this is all about making it easier to understand
      // the shape of the body, so we use DragListener for its touchSnag support so the body is discoverable
      this.addInputListener( new DragListener( {

        // just for vibration feedback, don't make the cursor look different
        pressCursor: null,

        press: ( event, listener ) => {
          const parentPoint = this.globalToParentPoint( event.pointer.point );
          for ( let i = 0; i < this.paths.length; i++ ) {
            this.paths[ i ].detectHit( parentPoint );
          }
        },
        drag: ( event, listener ) => {
          const parentPoint = this.globalToParentPoint( event.pointer.point );

          // find which shape contains the parent point, set its associated Property
          for ( let i = 0; i < this.paths.length; i++ ) {
            this.paths[ i ].detectHit( parentPoint );
          }
        },
        release: ( event, listener ) => {

          // no paths hit on release
          for ( let i = 0; i < this.paths.length; i++ ) {
            this.paths[ i ].property.set( false );
          }
        },

        tandem: tandem.createTandem( 'dragListener' )
      } ) );
    }

    addShape( shape, property, options ) {
      const hittablePath = new HittablePath( shape, property, options );
      this.paths.push( hittablePath );

      this.addChild( hittablePath );
    }

    showShapes() {
      for ( let i = 0; i < this.paths.length; i++ ) {
        this.paths[ i ].showShape();
      }
    }
  }

  /**
   * The Node to receive input, collects the Property that indicates the pointer is down over the provided shape.
   */
  class HittablePath extends Path {

    /**
     * @param {Shape} shape
     * @param {BooleanProperty} property - true when the pointer is down over this shape
     * @param {Objects} options
     */
    constructor( shape, property, options ) {
      options = _.extend( {

        // to make this shape visible during debugging
        debugStroke: 'green'
      }, options );

      super( shape );

      // @public (read-only)
      this.property = property;

      // @private
      this.debugStroke = options.debugStroke;
    }

    /**
     * Returns true if the point is within the shape.
     *
     * @param {Vector2} point
     * @returns {}
     */
    shapeContainsPoint( point ) {
      return this.shape.containsPoint( point );
    }

    /**
     * Sets the property based on whether or not the point is within the shape.
     *
     * @param {Vector2} point - in the global coordinate frame
     */
    detectHit( point ) {
      this.property.set( this.shape.containsPoint( point ) );
    }

    /**
     * Make the object shape visible. This is purely for debugging purposes.
     */
    showShape() {
      this.stroke = this.debugStroke;
    }
  }

  return johnTravoltage.register( 'ShapeHitDetector', ShapeHitDetector );
} );
