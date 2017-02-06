// Copyright 2013-2015, University of Colorado Boulder

/**
 * Background static elements of simulation
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Pattern = require( 'SCENERY/util/Pattern' );
  var Image = require( 'SCENERY/nodes/Image' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  // images
  var wallpaper = require( 'image!JOHN_TRAVOLTAGE/wallpaper.png' );
  var floor = require( 'image!JOHN_TRAVOLTAGE/floor.png' );
  var rug = require( 'image!JOHN_TRAVOLTAGE/rug.png' );
  var body = require( 'image!JOHN_TRAVOLTAGE/body.png' );
  var face = require( 'image!JOHN_TRAVOLTAGE/face.png' );
  var door = require( 'image!JOHN_TRAVOLTAGE/door.png' );
  var window = require( 'image!JOHN_TRAVOLTAGE/window.png' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function BackgroundNode( tandem ) {

    Node.call( this, { pickable: false } );

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
      x: 110,
      y: 446,
      scale: 0.58
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

    // add the face image, this is temporary and will be updated soon
    // see https://github.com/phetsims/john-travoltage/issues/83
    // position and scale determined empirically
    this.addChild( new Image( face, {
      x: 381,
      y: 61,
      scale: 1.20
    } ) );
  }

  johnTravoltage.register( 'BackgroundNode', BackgroundNode );

  return inherit( Node, BackgroundNode );
} );