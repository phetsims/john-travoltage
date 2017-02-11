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
  var door = require( 'image!JOHN_TRAVOLTAGE/door.png' );
  var window = require( 'image!JOHN_TRAVOLTAGE/window.png' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function BackgroundNode( tandem ) {

    Node.call( this, {
      pickable: false,
      tandem: tandem
    } );

    //wallpapers
    this.addChild( new Rectangle( -1000, -300, 3000, 1100, {
      fill: new Pattern( wallpaper ),
      tandem: tandem.createTandem( 'wallpaper' )
    } ) );

    // add the Window image
    this.addChild( new Image( window, {
      x: 50,
      y: 60,
      scale: 0.93,
      tandem: tandem.createTandem( 'window' )
    } ) );

    // add the floor image
    this.addChild( new Rectangle( -1000, 440, 3000, 1100, {
      fill: new Pattern( floor ),
      tandem: tandem.createTandem( 'floor' )
    } ) );

    // add the rug image
    this.addChild( new Image( rug, {
      x: 110,
      y: 446,
      scale: 0.58,
      tandem: tandem.createTandem( 'rug' )
    } ) );

    // add the door image
    this.addChild( new Image( door, {
      x: 513.5,
      y: 48,
      scale: 0.785,
      tandem: tandem.createTandem( 'door' )
    } ) );

    // add the body image
    this.addChild( new Image( body, {
      x: 260,
      y: 60,
      scale: 0.85,
      tandem: tandem.createTandem( 'body' )
    } ) );
  }

  johnTravoltage.register( 'BackgroundNode', BackgroundNode );

  return inherit( Node, BackgroundNode );
} );