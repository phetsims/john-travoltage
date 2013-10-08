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
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );

  //REVIEW overly broad interface, don't pass in the entire model, pass in the parts you need
  function SparkNode( sparkVisibleProperty, arm, doorknobPosition, addStepListener ) {
    var self = this;

    Node.call( this, {pickable: false} );

    sparkVisibleProperty.linkAttribute( this, 'visible' );
    var whitePath = new Path( null, {stroke: 'white', lineWidth: 4} );
    var bluePath = new Path( null, {stroke: 'blue', lineWidth: 1} );
    this.addChild( whitePath );
    this.addChild( bluePath );

    var numSegments = 10;
    addStepListener( function() {
      if ( self.visible ) {
        var shape = new Shape();

        //TODO: reduce allocations
        var point = arm.getFingerPosition();
        shape.moveToPoint( point );
        var distanceToTarget = doorknobPosition.distance( point );
        var segmentLength = distanceToTarget / numSegments;
        for ( var i = 0; i < numSegments; i++ ) {
          if ( i === numSegments - 1 ) {
            segmentLength = distanceToTarget;
            point = doorknobPosition;
          }
          else {

            //go 1/numSegments of the remaining distance to the target, in a direction roughly toward the target
            var delta = doorknobPosition.minus( point ).normalized().timesScalar( segmentLength );
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