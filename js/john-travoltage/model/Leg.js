// Copyright 2013-2022, University of Colorado Boulder

/**
 * Leg model of John Travoltage. Can rotate.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import johnTravoltage from '../../johnTravoltage.js';
import Appendage from './Appendage.js';
import JohnTravoltageModel from './JohnTravoltageModel.js';

class Leg extends Appendage {
  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // empirically determined by inspecting the view
    const pivotPoint = new Vector2( 398, 335 );

    super( pivotPoint, tandem, {
      initialAngle: 1.3175443221852239, // determined empirically with DebutUtils
      range: new Range( 0, Math.PI ),
      precision: 7
    } );

    // @public (sonification) - speed of leg determines volume of some audio
    this.angularVelocityProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'angularVelocityProperty' ),
      units: 'radians/s'
    } );

    // true when the foot is in contact with the carpet
    this.shoeOnCarpetProperty = new DerivedProperty( [ this.angleProperty ],
      angle => angle > JohnTravoltageModel.FOOT_ON_CARPET_MIN_ANGLE && angle < JohnTravoltageModel.FOOT_ON_CARPET_MAX_ANGLE, {
        phetioValueType: BooleanIO,
        tandem: tandem.createTandem( 'shoeOnCarpetProperty' )
      } );
  }

  /**
   * Reset the leg.
   * @public
   */
  reset() {
    this.angularVelocityProperty.reset();
    super.reset();
  }

  /**
   * Calculate the change in angle from the initial value at construction.
   * @returns {number}
   * @public
   */
  deltaAngle() { return this.angleProperty.get() - this.initialAngle; }
}

johnTravoltage.register( 'Leg', Leg );

export default Leg;