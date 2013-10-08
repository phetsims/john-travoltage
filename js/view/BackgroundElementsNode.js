// Copyright 2002-2013, University of Colorado Boulder

/**
 * Background static elements of simulation
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Pattern = require( 'SCENERY/util/Pattern' );
  var Image = require( 'SCENERY/nodes/Image' );
  var wallpaper = require( 'image!JOHN_TRAVOLTAGE/../images/wallpaper.png' );
  var floor = require( 'image!JOHN_TRAVOLTAGE/../images/floor.png' );
  var rug = require( 'image!JOHN_TRAVOLTAGE/../images/rug.svg' );
  var body = require( 'image!JOHN_TRAVOLTAGE/../images/body.png' );
  var door = require( 'image!JOHN_TRAVOLTAGE/../images/door.svg' );
  var window = require( 'image!JOHN_TRAVOLTAGE/../images/window.png' );

  //REVIEW position is not used, and not provided by call site
  function BackgroundElementsNode( position ) {

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
      x: 360,
      y: 40,
      scale: 0.7
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