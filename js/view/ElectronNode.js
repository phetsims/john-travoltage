// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for minusCharge.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Rect = require( 'DOT/Rectangle' );
  var Electron = require( 'JOHN_TRAVOLTAGE/model/Electron' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Vector2 = require( 'DOT/Vector2' );
  require( 'SCENERY/Scene' ); //Force Scene to load before using Node.toImage

  var radius = Electron.radius;

  //Scale up before rasterization so it won't be too pixellated/fuzzy
  var scale = 2;

  var minusChargeNode = new Node( {
    children: [
      new Circle( radius, {
        x: 0, y: 0,
        fill: new RadialGradient( 2, -3, 2, 2, -3, 7 )
          .addColorStop( 0, '#4fcfff' )
          .addColorStop( 0.5, '#2cbef5' )
          .addColorStop( 1, '#00a9e8' )
      } ),

      new Rectangle( 0, 0, 11, 2, {
        fill: 'white',
        centerX: 0,
        centerY: 0
      } )
    ], scale: scale
  } );

  var node = new Node();
  minusChargeNode.toImage( function( im ) {

    //Scale back down so the image will be the desired size
    node.children = [new Image( im, {scale: 1.0 / scale} )];
  } );

  var legBounds = new Rect( 368.70275791624107, 332.0122574055158, 600, 600 );

  function ElectronNode( electron, model, leg ) {
    var self = this;

    Node.call( this, {pickable: false} );

    this.addChild( node );
    var width = node.width;
    var height = node.height;

    electron.positionProperty.link( function( position ) {

      //If in the leg, then show it at the correctly rotated angle
      if ( legBounds.containsPoint( position ) ) {

        var legPoint = leg.position;
        var dr = new Vector2( position.x - legPoint.x, position.y - legPoint.y );
        var deltaAngle = leg.deltaAngle();
        dr = dr.rotated( deltaAngle ).plus( legPoint );
        self.setTranslation( dr.x, dr.y );
      }
      else {
        self.setTranslation( position.x - node.width / 2, position.y - node.height / 2 );
      }
    } );
  }

  return inherit( Node, ElectronNode );
} );