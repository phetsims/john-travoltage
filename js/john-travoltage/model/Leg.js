// Copyright 2013-2019, University of Colorado Boulder

/**
 * Leg model of John Travoltage. Can rotate.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import johnTravoltage from '../../johnTravoltage.js';
import Appendage from './Appendage.js';

/**
 * @param {Tandem} tandem
 * @constructor
 */
function Leg( tandem ) {

  // empirically determined by inspecting the view
  const pivotPoint = new Vector2( 398, 335 );

  Appendage.call( this, pivotPoint, tandem, {
    initialAngle: 1.3175443221852239, // determined empirically with DebutUtils
    range: new Range( 0, Math.PI ),
    precision: 7
  } );

  // @public (sonification) - speed of leg determines volume of some audio
  this.angularVelocityProperty = new NumberProperty( 0, {
    phetioReadOnly: true,
    tandem: tandem.createTandem( 'angularVelocityProperty' ),
    units: 'radians/second'
  } );
}

johnTravoltage.register( 'Leg', Leg );

export default inherit( Appendage, Leg, {

  /**
   * Reset the leg.
   * @public
   */
  reset: function() {
    this.angularVelocityProperty.reset();
    Appendage.prototype.reset.call( this );
  },

  /**
   * Calculate the change in angle from the initial value at construction.
   * @returns {number}
   * @public
   */
  deltaAngle: function() { return this.angleProperty.get() - this.initialAngle; }
} );