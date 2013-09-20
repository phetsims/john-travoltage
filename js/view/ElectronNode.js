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

  function ElectronNode( electron, model, leg, legNode, johnTravoltageView ) {
    var electronNode = this;

    Node.call( this, {pickable: false} );

    this.addChild( node );
    var width = this.width;
    var height = this.height;

//    var debugPoint = new Circle( 3, {fill: 'yellow'} );
//    johnTravoltageView.addChild( debugPoint );

    var history = [];
    for ( var i = 0; i < 10; i++ ) {
      history.push( 'leg' );
    }

    var legText = 'leg';
    var bodyText = 'body';
    electron.positionProperty.link( function( position ) {

      history.push( legBounds.containsPoint( position ) ? legText : bodyText );
      if ( history.length > 10 ) {
        history.shift();
      }

      var inLegCount = 0;
      var inBodyCount = 0;
      for ( var i = 0; i < history.length; i++ ) {
        var element = history[i];
        if ( element === legText ) {
          inLegCount++;
        }
        else {
          inBodyCount++;
        }
      }

      var legPoint;
      var dr;
      var deltaAngle;
      //If in the leg, then show it at the correctly rotated angle
      if ( inLegCount === history.length ) {
        legPoint = leg.position;

        //The vector relative to the leg pivot
        dr = new Vector2( position.x - legPoint.x, position.y - legPoint.y );

        //The leg'legText rotated angle
        deltaAngle = leg.deltaAngle();
        dr = dr.rotated( deltaAngle ).plus( legPoint );
        electronNode.setTranslation( dr.x - node.width / 2, dr.y - node.height / 2 );
      }
      else if ( inBodyCount === history.length ) {
        electronNode.setTranslation( position.x - node.width / 2, position.y - node.height / 2 );
      }

      //Interpolate for smoothness at odd angles
      else {

        legPoint = leg.position;

        dr = new Vector2( position.x - legPoint.x, position.y - legPoint.y );

        deltaAngle = leg.deltaAngle();
        dr = dr.rotated( deltaAngle ).plus( legPoint );
        var a = new Vector2( dr.x - node.width / 2, dr.y - node.height / 2 );
        var b = new Vector2( position.x - node.width / 2, position.y - node.height / 2 );
        var c = a.blend( b, inBodyCount / history.length );
        electronNode.setTranslation( c.x, c.y );
      }

//      debugPoint.setTranslation( position.x, position.y );
    } );
  }

  return inherit( Node, ElectronNode );
} );