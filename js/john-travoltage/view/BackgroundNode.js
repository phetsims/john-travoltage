// Copyright 2013-2022, University of Colorado Boulder

/**
 * Background static elements of simulation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */

import { Image, Node, Pattern, Rectangle } from '../../../../scenery/js/imports.js';
import body_png from '../../../images/body_png.js';
import door_png from '../../../images/door_png.js';
import floor_png from '../../../images/floor_png.js';
import rug_png from '../../../images/rug_png.js';
import wallpaper_png from '../../../images/wallpaper_png.js';
import window_png from '../../../images/window_png.js';
import johnTravoltage from '../../johnTravoltage.js';

class BackgroundNode extends Node {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    super( {
      pickable: false,
      tandem: tandem
    } );

    //wallpapers
    this.addChild( new Rectangle( -1000, -300, 3000, 1100, {
      fill: new Pattern( wallpaper_png ),
      tandem: tandem.createTandem( 'wallpaper' )
    } ) );

    // add the Window image
    this.addChild( new Image( window_png, {
      x: 50,
      y: 60,
      scale: 0.93,
      tandem: tandem.createTandem( 'window' )
    } ) );

    // add the floor image
    this.addChild( new Rectangle( -1000, 440, 3000, 1100, {
      fill: new Pattern( floor_png ),
      tandem: tandem.createTandem( 'floor' )
    } ) );

    // add the rug image
    this.addChild( new Image( rug_png, {
      x: 110,
      y: 446,
      scale: 0.58,
      tandem: tandem.createTandem( 'rug' )
    } ) );

    // add the door image
    this.addChild( new Image( door_png, {
      x: 513.5,
      y: 48,
      scale: 0.785,
      tandem: tandem.createTandem( 'door' )
    } ) );

    // add the body image
    this.addChild( new Image( body_png, {
      x: 260,
      y: 60,
      scale: 0.85,
      tandem: tandem.createTandem( 'body' )
    } ) );
  }
}

johnTravoltage.register( 'BackgroundNode', BackgroundNode );

export default BackgroundNode;