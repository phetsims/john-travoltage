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

    model.sparkVisibleProperty.linkAttribute( this, 'visible' );
    var whitePath = new Path( null, {stroke: 'white', lineWidth: 4} );
    var bluePath = new Path( null, {stroke: 'blue', lineWidth: 1} );
    this.addChild( whitePath );
    this.addChild( bluePath );

    var numSegments = 10;
    model.on( 'step', function() {
      if ( self.visible ) {
        var shape = new Shape();

        //TODO: reduce allocations
        var point = model.arm.getFingerPosition();
        shape.moveToPoint( point );
        var distanceToTarget = model.doorknobPosition.distance( point );
        var segmentLength = distanceToTarget / numSegments;
        for ( var i = 0; i < numSegments; i++ ) {
          if ( i === numSegments - 1 ) {
            segmentLength = distanceToTarget;
            point = model.doorknobPosition;
          }
          else {

            //go 1/numSegments of the remaining distance to the target, in a direction roughly toward the target
            var delta = model.doorknobPosition.minus( point ).normalized().timesScalar( segmentLength );
            delta = delta.rotated( Math.random() - 0.5 );
            point = point.plus( delta );
          }

          shape.lineToPoint( point );
        }

        whitePath.shape = shape;
        bluePath.shape = shape;
      }
    } );
  }

  return inherit( Node, SparkNode );
} );