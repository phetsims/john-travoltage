// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for the spark of the model.
 @author Vasily Shakhov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  function SparkNode( model, armModel,box2dModel ) {
    var self = this;

    // super constructor
    Node.call( this );

    var customBackgroundShape = new Shape();
    var backgroundPath = new Path( {
      shape: customBackgroundShape,
      stroke: 'white',
      lineWidth: 4,
      pickable: false,
      renderer: 'svg'
    } );
    this.addChild( backgroundPath );

    var customShape = new Shape();
    var path = new Path( {
      shape: customShape,
      stroke: 'blue',
      lineWidth: 1,
      pickable: false,
      renderer: 'svg'
    } );
    this.addChild( path );


    //changes visual position
    model.link( 'verticles', function updatePathOfSpark( verts ) {
      customShape = new Shape();
      customBackgroundShape = new Shape();
      customShape.moveTo( verts[0].x, model.verticles[0].y );
      customBackgroundShape.moveTo( verts[0].x, model.verticles[0].y );
      for ( var i = 1; i < model.verticles.length; i++ ) {
        customShape.lineTo( model.verticles[i].x, model.verticles[i].y );
        customShape.moveTo( model.verticles[i].x, model.verticles[i].y );
        customBackgroundShape.lineTo( model.verticles[i].x, model.verticles[i].y );
        customBackgroundShape.moveTo( model.verticles[i].x, model.verticles[i].y );
      }

      path.shape = customShape;
      backgroundPath.shape = customBackgroundShape;
    } );

    armModel.link('rotationAngle',function checkAndUpdateSpark() {
      model.checkAndUpdateSpark(armModel);
    });

    box2dModel.link('isSpark', function setSparkVisibility(isVisible){
       self.visible = isVisible;
    });

    model.viewNode = this;




  }

  inherit( Node, SparkNode ); // prototype chaining

  return SparkNode;
} );