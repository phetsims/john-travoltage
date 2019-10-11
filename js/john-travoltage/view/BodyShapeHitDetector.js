// Copyright 2019, University of Colorado Boulder

/**
 * The ShapeHitDetector for objects in the john-travoltage simulation. Used for prototyping vibration feedback.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const ShapeHitDetector = require( 'TAPPI/view/ShapeHitDetector' );

  // constants

  class BodyShapeHitDetector extends ShapeHitDetector {

    constructor( model, view, tandem ) {
      super( view, tandem );

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

  return johnTravoltage.register( 'BodyShapeHitDetector', BodyShapeHitDetector );
} );
