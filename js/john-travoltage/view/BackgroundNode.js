// Copyright 2013-2019, University of Colorado Boulder

/**
 * Background static elements of simulation
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Pattern from '../../../../scenery/js/util/Pattern.js';
import body from '../../../images/body_png.js';
import door from '../../../images/door_png.js';
import floor from '../../../images/floor_png.js';
import rug from '../../../images/rug_png.js';
import wallpaper from '../../../images/wallpaper_png.js';
import window from '../../../images/window_png.js';
import johnTravoltage from '../../johnTravoltage.js';

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

inherit( Node, BackgroundNode );
export default BackgroundNode;