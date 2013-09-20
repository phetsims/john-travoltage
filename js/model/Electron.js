// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a John-Travoltage.
 * Point charge model. Each charge has a position and box2d instance.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  function Electron( x, y, model ) {
    PropertySet.call( this, {
      position: new Vector2( x, y )
    } );
    this.model = model;
  }

  //statics
  Electron.radius = 8;
  Electron.charge = -1;

  return inherit( PropertySet, Electron, {
    step: function( dt, globalModel ) {
      var originalPosition = this.position;
      var newPosition = this.position.plus( new Vector2( 0, -1 ) );

      var segments
      var barriers = model.verts.
                       //See if it crossed a barrier, and reflect it
                       //TODO: prevent allocations?
                       this.position = newPosition;
    }
  } );
} );