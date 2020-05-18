// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model for John Travoltage's arm, which can rotate about the shoulder.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import johnTravoltage from '../../johnTravoltage.js';
import Appendage from './Appendage.js';

/**
 * @param {Tandem} tandem
 * @constructor
 */
function Arm( tandem ) {

  // position determined empirically with DebugUtils
  const pivotPoint = new Vector2( 423.6179673321235, 229.84969476984 );

  Appendage.call( this, pivotPoint, tandem, {

    // with mouse interaction, arm rotates from -pi to pi. With the keyboard, there are specific positions where
    // '0' is at the doorknob, and so the value goes from -pi + 0.41 to pi + 0.41. So this includes the full
    // range, see https://github.com/phetsims/john-travoltage/issues/268
    range: new Range( -Math.PI + 0.41, Math.PI + 0.41 )
    // precision: 7
  } );

  // Exact finger position sampled using DebugUtils.js
  // var finger = new Vector2( 534.3076703633706, 206.63766358806117 );
  const finger = new Vector2( 534.3076704, 206.6376636 );

  // @public (read-only) - vector from pivot point to the finger
  this.fingerVector = finger.minus( this.position );
}

johnTravoltage.register( 'Arm', Arm );

inherit( Appendage, Arm, {

  /**
   * Reset the arm.
   * @public
   */
  reset: function() {
    this.angleProperty.reset();
    Appendage.prototype.reset.call( this );
  },

  /**
   * Gets the position of the finger with the current appendage rotation.
   * @returns {Vector2}
   * @public
   */
  getFingerPosition: function() {
    return this.fingerVector.rotated( this.angleProperty.get() ).plus( this.position );
  }
} );

export default Arm;