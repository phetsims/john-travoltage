// Copyright 2002-2013, University of Colorado

/**
 * main Model container.
 * @author Vasily Shakhov (Mlearner.com)
 */
define( function( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );
  var ArmModel = require( 'model/ArmModel' );

  var JohnTravoltage = Fort.Model.extend(
      {
        //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
        defaults: {
          charge : 0
        },

        //Main constructor
        init: function() {
          this.arm = new ArmModel( 410, 185 );
        },

        // Called by the animation loop
        step: function() {
        }

        // Reset the entire model

      } );

  return JohnTravoltage;
} );
