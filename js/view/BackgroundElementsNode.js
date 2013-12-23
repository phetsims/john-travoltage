// Copyright 2002-2013, University of Colorado Boulder

/**
 * Background static elements of simulation
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Pattern = require( 'SCENERY/util/Pattern' );
  var Image = require( 'SCENERY/nodes/Image' );
  var wallpaper = require( 'image!JOHN_TRAVOLTAGE/wallpaper.png' );
  var floor = require( 'image!JOHN_TRAVOLTAGE/floor.png' );
  var rug = require( 'image!JOHN_TRAVOLTAGE/rug.svg' );
  var body = require( 'image!JOHN_TRAVOLTAGE/body.png' );
  var door = require( 'image!JOHN_TRAVOLTAGE/door.png' );
  var window = require( 'image!JOHN_TRAVOLTAGE/window.png' );

  function BackgroundElementsNode() {

    Node.call( this, {pickable: false} );

    //wallpapers
    this.addChild( new Rectangle( -1000, -300, 3000, 1100, {
      fill: new Pattern( wallpaper )
    } ) );

    // add the Window image
    this.addChild( new Image( window, {
      x: 50,
      y: 60,
      scale: 0.93
    } ) );

    // add the floor image
    this.addChild( new Rectangle( -1000, 440, 3000, 1100, {
      fill: new Pattern( floor )
    } ) );

    // add the rug image
    this.addChild( new Image( rug, {
      x: 100,
      y: 365,
      scale: 0.6
    } ) );

    // add the door image
    this.addChild( new Image( door, {
      x: 513.5,
      y: 48,
      scale: 0.785
    } ) );

    // add the body image
    this.addChild( new Image( body, {
      x: 260,
      y: 60,
      scale: 0.85
    } ) );
  }

  return inherit( Node, BackgroundElementsNode );
} );