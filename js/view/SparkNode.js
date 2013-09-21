// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the spark of the model.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  function SparkNode( model ) {
    var self = this;

    Node.call( this, {pickable: false} );

    model.sparkProperty.linkAttribute( this, 'visible' );
    this.addChild( new Circle( 10, {fill: 'yellow'} ) );
//
//    var customBackgroundShape = new Shape();
//    var backgroundPath = new Path( customBackgroundShape, {
//      stroke: 'white',
//      lineWidth: 4,
//      pickable: false
//    } );
//    this.addChild( backgroundPath );
//
//    var customShape = new Shape();
//    var path = new Path( customShape, {
//      stroke: 'blue',
//      lineWidth: 1,
//      pickable: false
//    } );
//    this.addChild( path );


    //changes visual position
//    model.verticesProperty.link( function updatePathOfSpark( verts ) {
//      customShape = new Shape();
//      customBackgroundShape = new Shape();
//      customShape.moveTo( verts[0].x, model.vertices[0].y );
//      customBackgroundShape.moveTo( verts[0].x, model.vertices[0].y );
//      for ( var i = 1; i < model.vertices.length; i++ ) {
//        customShape.lineTo( model.vertices[i].x, model.vertices[i].y );
//        customShape.moveTo( model.vertices[i].x, model.vertices[i].y );
//        customBackgroundShape.lineTo( model.vertices[i].x, model.vertices[i].y );
//        customBackgroundShape.moveTo( model.vertices[i].x, model.vertices[i].y );
//      }
//
//      path.shape = customShape;
//      backgroundPath.shape = customBackgroundShape;
//    } );

//    arm.angleProperty.link( function checkAndUpdateSpark() {
//      model.checkAndUpdateSpark( arm );
//    } );

//    box2dModel.isSparkProperty.link( function setSparkVisibility( isVisible ) {
//      self.visible = isVisible;
//    } );

//    model.viewNode = this;
  }

  return inherit( Node, SparkNode ); // prototype chaining
} );