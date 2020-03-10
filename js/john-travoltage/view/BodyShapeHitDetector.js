// Copyright 2019-2020, University of Colorado Boulder

/**
 * The ShapeHitDetector for objects in the john-travoltage simulation. Used for prototyping vibration feedback.
 *
 * @author Jesse Greenberg
 */

import ShapeHitDetector from '../../../../tappi/js/view/ShapeHitDetector.js';
import johnTravoltage from '../../johnTravoltage.js';

// constants

class BodyShapeHitDetector extends ShapeHitDetector {

  /**
   * @param {JohnTravoltageModel} model
   * @param {JohnTravoltageView} view - parent node for transformations for the ShapeHitDetector
   */
  constructor( model, view ) {
    super( view );

    this.addShape( model.touchableBodyShape, model.touchingBodyProperty );
    this.addShape( model.carpetShape, model.touchingCarpetProperty );
    this.addShape( view.arm.hitShape, model.touchingArmProperty );
    this.addShape( view.leg.hitShape, model.touchingLegProperty );

    model.arm.angleProperty.link( angle => {
      this.updateShape( view.arm.hitShape, model.touchingArmProperty );
    } );

    model.leg.angleProperty.link( angle => {
      this.updateShape( view.leg.hitShape, model.touchingLegProperty );
    } );
  }
}

johnTravoltage.register( 'BodyShapeHitDetector', BodyShapeHitDetector );
export default BodyShapeHitDetector;