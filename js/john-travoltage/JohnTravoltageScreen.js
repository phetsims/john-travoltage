// Copyright 2013-2019, University of Colorado Boulder

/**
 * Screen for John Travoltage
 *
 * @author Sam Reid
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const JohnTravoltageModel = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/JohnTravoltageModel' );
  const JohnTravoltageView = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/JohnTravoltageView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  /**
   * @param tandem
   * @constructor
   */
  function JohnTravoltageScreen( tandem ) {
    Screen.call( this,
      function() {
        return new JohnTravoltageModel( tandem.createTandem( 'model' ) );
      },
      function( model ) {
        return new JohnTravoltageView( model, tandem.createTandem( 'view' ) );
      }, {
        backgroundColorProperty: new Property( '#9ddcf8' ),
        tandem: tandem
      }
    );
  }

  johnTravoltage.register( 'JohnTravoltageScreen', JohnTravoltageScreen );

  return inherit( Screen, JohnTravoltageScreen );
} );

