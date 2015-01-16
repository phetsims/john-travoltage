// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for minusCharge.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Rect = require( 'DOT/Rectangle' );
  var Electron = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Electron' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Vector2 = require( 'DOT/Vector2' );

  var radius = Electron.radius;

  //Scale up before rasterization so it won't be too pixellated/fuzzy
  var scale = 2;

  var minusChargeNode = new Node( {
    children: [
      new Circle( radius, {
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
  minusChargeNode.top = 0;
  minusChargeNode.left = 0;

  var node = new Node();
  minusChargeNode.toImage( function( im ) {

    //Scale back down so the image will be the desired size
    node.children = [ new Image( im, { scale: 1.0 / scale } ) ];
  }, 0, 0, minusChargeNode.width, minusChargeNode.height );

  //Bounds for the leg and arm regions sampled by clicking on the JohnTravoltageView coordinates
  var legBounds = new Rect( 368.70275791624107, 332.0122574055158, 600, 600 );
  var armBounds = new Rect( 427.41602634467614, 210.03732162458834, 70, 42 );

  var topLeft = new Vector2( 427.83601359003404, 154.03488108720273 );
  var bottomRight = new Vector2( 558.1263873159684, 294.67542468856175 );
  armBounds = new Rect( topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y );

  //Precompute and reuse to avoid allocations
  var a = new Vector2();
  var b = new Vector2();
  var dr = new Vector2();

  var debugPosition = false;

  function ElectronNode( electron, leg, arm ) {
    var electronNode = this;

    Node.call( this, { pickable: false } );

    this.addChild( node );
    node.centerX = 0;
    node.centerY = 0;
    if ( debugPosition ) {
      var circle = new Circle( 2, { fill: 'yellow' } );
      circle.centerX = 0;
      circle.centerY = 0;
      this.addChild( circle );

      this.addChild( new Rectangle( node.bounds, { lineWidth: 1, stroke: 'red' } ) );
    }

    //For debugging, show the electron id
//    this.addChild( new Text( '' + electron.id, {fill: 'white'} ) );

    var history = [];

    var legText = 'leg';
    var bodyText = 'body';
    var armText = 'arm';

    //Electrons start in the leg
    for ( var i = 0; i < 10; i++ ) {
      history.push( legText );
    }

    //Electrons fire a position changed every step whether their position changed or not, so that it will still be drawn in the proper place if the leg angle changed.
    electron.positionProperty.link( function( position ) {

      history.push( legBounds.containsPoint( position ) ? legText :
                    armBounds.containsPoint( position ) ? armText :
                    bodyText );
      if ( history.length > 10 ) {
        history.shift();
      }

      var inLegCount = 0;
      var inBodyCount = 0;
      var inArmCount = 0;
      var deltaAngle, c;
      for ( var i = 0; i < history.length; i++ ) {
        var element = history[ i ];
        if ( element === legText ) {
          inLegCount++;
        }
        else if ( element === armText ) {
          inArmCount++;
        }
        else {
          inBodyCount++;
        }
      }

      //Simplest case, it wasn't in any appendage
      if ( inBodyCount === history.length ) {
        electronNode.setTranslation( position.x, position.y );
      }

      //Interpolate for smoothness at intersection between leg/body
      //TODO: improve performance and reduce allocations
      else if ( inLegCount >= inArmCount ) {

        var legPoint = leg.position;

        dr.setXY( position.x - legPoint.x, position.y - legPoint.y );

        //The leg's rotated angle
        deltaAngle = leg.deltaAngle();
        dr = dr.rotated( deltaAngle ).plus( legPoint );

        //No need to blend, it was in the leg the whole time
        if ( inLegCount === history.length ) {
          electronNode.setTranslation( dr.x, dr.y );
        }
        else {
          a.setXY( dr.x, dr.y );
          b.setXY( position.x, position.y );
          c = a.blend( b, inBodyCount / history.length );
          electronNode.setTranslation( c.x, c.y );
        }
      }

      //This assumes that no electron will blend arm/leg positions, which is a fair assumption since it is difficult to get from the leg to the arm in only 10 history steps
      else {

        var armPoint = arm.position;

        dr.setXY( position.x - armPoint.x, position.y - armPoint.y );

        //The leg's rotated angle
        deltaAngle = arm.deltaAngle();
        dr = dr.rotated( deltaAngle ).plus( armPoint );

        //No need to blend, it was in the leg the whole time
        if ( inArmCount === history.length ) {
          electronNode.setTranslation( dr.x, dr.y );
        }
        else {
          a.setXY( dr.x, dr.y );
          b.setXY( position.x, position.y );
          c = a.blend( b, inBodyCount / history.length );
          electronNode.setTranslation( c.x, c.y );
        }
      }

    } );
  }

  return inherit( Node, ElectronNode );
} );
