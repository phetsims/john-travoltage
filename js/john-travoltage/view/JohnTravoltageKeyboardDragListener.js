// Copyright 2013-2017, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Scenery display object (scene graph node) for the leg of the model.
 *
 * @author Michael Barlow
 */

define( function( require ) {
  'use strict';

  // modules
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  // var inherit = require( 'PHET_CORE/inherit' );
  // var AccessibleSlider = require( 'SUN/accessibility/AccessibleSlider' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  function JohnTravoltageAccessibleSlider( modelProperty, options ) {
    // var self = this;

    options = _.extend( {

    }, options );

    this.inputValueProperty = new NumberProperty();

  }

  johnTravoltage.register( 'JohnTravoltageAccessibleSlider', JohnTravoltageAccessibleSlider );

  return JohnTravoltageAccessibleSlider;
} );