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
  var JohnTravoltageImages = require( 'JOHN_TRAVOLTAGE/JohnTravoltageImages' );

  function BackgroundElementsNode( position ) {

    Node.call( this, {pickable: false} );

    //wallpapers
    this.addChild( new Rectangle( -1000, -300, 3000, 1100, {
      fill: new Pattern( JohnTravoltageImages.getImage( 'wallpaper.png' ) )
    } ) );

    // add the Window image
    this.addChild( new Image( JohnTravoltageImages.getImage( 'window.svg' ), {
      x: 50,
      y: 60,
      scale: 0.48
    } ) );

    // add the floor image
    this.addChild( new Rectangle( -1000, 440, 3000, 1100, {
      fill: new Pattern( JohnTravoltageImages.getImage( 'floor.png' ) )
    } ) );

    // add the rug image
    this.addChild( new Image( JohnTravoltageImages.getImage( 'rug.svg' ), {
      x: 100,
      y: 365,
      scale: 0.6
    } ) );

    // add the door image
    this.addChild( new Image( JohnTravoltageImages.getImage( 'door.svg' ), {
      x: 360,
      y: 40,
      scale: 0.7
    } ) );

    // add the body image
    this.addChild( new Image( JohnTravoltageImages.getImage( 'body.png' ), {
      x: 260,
      y: 60,
      scale: 0.85
    } ) );
  }

  return inherit( Node, BackgroundElementsNode ); // prototype chaining
} );