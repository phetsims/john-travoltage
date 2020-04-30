// Copyright 2017-2020, University of Colorado Boulder

/**
 * A base type for appedages in this sim. Extended by Arm.js and Leg.js.  Appendages have a pivot point, and an
 * observable angle which is used for dragging.
 *
 * @author Jesse Greenberg
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import johnTravoltage from '../../johnTravoltage.js';

const MOVEMENT_DIRECTIONS = {
  CLOSER: 'CLOSER',
  FARTHER: 'FARTHER'
};

/**
 * @constructor
 * @param {Vector2} pivotPoint
 * @param {Tandem} tandem
 * @param {Object} [options]
 */
function Appendage( pivotPoint, tandem, options ) {

  options = merge( {
    initialAngle: -0.5, // radians
    range: new Range( -Math.PI, Math.PI ),
    precision: 7
  }, options );

  // @private
  this.initialAngle = options.initialAngle;

  // @public
  this.angleProperty = new NumberProperty( this.initialAngle, {
    tandem: tandem.createTandem( 'angleProperty' ),
    units: 'radians',
    range: options.range
  } );

  // @public
  this.borderVisibleProperty = new BooleanProperty( true, {
    tandem: tandem.createTandem( 'borderVisibleProperty' )
  } );

  // @public (read-only)
  this.position = pivotPoint;

  // @public - Whether or not the appendage is currently being dragged
  this.isDraggingProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'draggingProperty' )
  } );

  // @public - emits an event when the appendage is reset
  this.appendageResetEmitter = new Emitter();
}

johnTravoltage.register( 'Appendage', Appendage );

inherit( Object, Appendage, {

  /**
   * Reset the appendage.
   * @public
   */
  reset: function() {
    this.angleProperty.reset();
    this.appendageResetEmitter.emit();
  }
}, {

  // @public @static
  MOVEMENT_DIRECTIONS: MOVEMENT_DIRECTIONS
} );

export default Appendage;