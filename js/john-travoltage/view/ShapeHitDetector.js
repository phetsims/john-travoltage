// Copyright 2019, University of Colorado Boulder

/**
 * A listener that can be added to a Node or the Display to detect if a pointer is over a colleciton
 * of shapes. You can add a shape with addShape, which takes a Shape and a Property. While the pointer is down over the
 * shape, the associated Property will be set to true so that you can observe this behavior.
 *
 * NOTE: This is intended to be added to the display. At one point it extended DragListener. This worked well when
 * added to a Node of the Display, but caused errors when added to the Display directly. If we use this more,
 * figure out why.
 *
 * In the meantime, creating a custom listener. It doesn't support many things taht would come for free with
 * DragListener (like interruption).
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  // const DragListener = require( 'SCENERY/listeners/DragListener' );
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const merge = require( 'PHET_CORE/merge' );
  const Path = require( 'SCENERY/nodes/Path' );

  class ShapeHitListener {

    /**
     * @param {Tandem} tandem
     */
    constructor( parent, tandem ) {

      // @private {Hittable[]} - collection of shape/Property to be detected
      this.hittables = [];

      // @private {Node} - the parent node of this listener for reference frame transforms
      this.parent = parent;

      // @private {boolean} - is a pointer down and using this listener?
      this.isPressed = false;

      // @private {Object} - attached to the pointer on `down` if the pointer isn't already attached and interacting
      // with other things
      this._pointerListener = {
        move: event => {
          if ( this.isPressed ) {
            const parentPoint = this.parent.globalToLocalPoint( event.pointer.point );

            // find which shape contains the parent point, set its associated Property
            for ( let i = 0; i < this.hittables.length; i++ ) {
              this.hittables[ i ].detectHit( parentPoint );
            }
          }
        },
        up: event => {
          // no paths hit on release
          for ( let i = 0; i < this.hittables.length; i++ ) {
            this.hittables[ i ].property.set( false );
          }
        }
      };
    }

    /**
     * For the scenery listener API, detects any hits and attaches listener to the pointer for movement and eventually
     * listener removal.
     * @param {SceneryEvent} event
     */
    down( event ) {

      // only begin dragging if pointer isn't already interacting with something
      if ( !event.pointer.isAttached() ) {
        this.isPressed = true;

        const parentPoint = this.parent.globalToLocalPoint( event.pointer.point );
        for ( let i = 0; i < this.hittables.length; i++ ) {
          this.hittables[ i ].detectHit( parentPoint );
        }

        event.pointer.addInputListener( this._pointerListener, true );
      }
    }

    /**
     * For the scenery listener API, removes the pointer listener when done.
     *
     * @param {SceneryEvent} event
     */
    up( event ) {
      if ( this.isPressed ) {

        // warning - no multitouch support
        this.isPressed = false;
        event.pointer.removeInputListener( this._pointerListener );
      }
    }

    /**
     * Add a shape to the detectr, Property set true when pointer is down over shape.
     *
     * @param {Shape} shape
     * @param {Property} property
     */
    addShape( shape, property, options ) {
      const hittable = new Hittable( shape, property, options );
      this.hittables.push( hittable );
    }

    /**
     * Set the shape on the hittable associated with the provided Property. Useful if your shape
     * needs to move around.
     *
     * @param {Property} property - previously
     */
    updateShape( shape, property ) {

      const hittable = _.find( this.hittables, entry => {
        return entry.property === property;
      } );
      assert && assert( hittable !== undefined, 'could not find hittable' );

      hittable.shape = shape;
    }

    /**
     * For debugging. Show attached shapes visually.
     * @returns {[type]} [description]
     */
    getDebugPaths() {
      const paths = [];
      for ( let i = 0; i < this.hittables.length; i++ ) {
        paths.push( this.hittables[ i ].getDebugPath() );
      }

      return paths;
    }
  }

  /**
   * The Node to receive input, collects the Property that indicates the pointer is down over the provided shape.
   */
  class Hittable {

    /**
     * @param {Shape} shape
     * @param {BooleanProperty} property - true when the pointer is down over this shape
     * @param {Objects} options
     */
    constructor( shape, property, options ) {
      options = merge( {

        // to make this shape visible during debugging
        debugStroke: 'green'
      }, options );

      this.shape = shape;

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
    getDebugPath() {
      return new Path( this.shape, {
        stroke: this.debugStroke,
        pickable: false
      } );
    }
  }

  return johnTravoltage.register( 'ShapeHitDetector', ShapeHitListener );
} );
