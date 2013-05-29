// Copyright 2002-2013, University of Colorado

/**
 * main Model container.
 * @author Vasily Shakhov (Mlearner.com)
 */
define( function( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );

  var JohnTravoltage = Fort.Model.extend(
      {
        //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
        defaults: {},

        //Main constructor
        init: function( width, height ) {},

        // Called by the animation loop
        step: function() {
        }

        // Reset the entire model

      } );

  return JohnTravoltage;
} );
