// Copyright 2019, University of Colorado Boulder

/**
 * TODO: Type Documentation
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const ShapeHitDetector = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ShapeHitDetector' );
  const Shape = require( 'KITE/Shape' );

  // constants

  class BodyShapeHitDetector extends ShapeHitDetector {

    constructor( model, view, tandem ) {
      super( view, tandem );

      this.addShape( model.touchableBodyShape, model.touchingBodyProperty );
      this.addShape( model.carpetShape, model.touchingCarpetProperty );
      this.addShape( Shape.bounds( view.arm.bounds ), model.touchingArmProperty );
      this.addShape( Shape.bounds( view.leg.bounds ), model.touchingLegProperty );

      model.arm.angleProperty.link( angle => {
        this.updateShape( Shape.bounds( view.arm.bounds ), model.touchingArmProperty );
      } );

      model.leg.angleProperty.link( angle => {
        this.updateShape( Shape.bounds( view.leg.bounds ), model.touchingLegProperty );
      } );
    }
  }

  return johnTravoltage.register( 'BodyShapeHitDetector', BodyShapeHitDetector );
} );
