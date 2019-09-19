// Copyright 2013-2018, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the spark of the model.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  /**
   * Constructor for the SparkNode, which shows the animated spark from the finger to the doorknob when electrons are flowing out.
   *
   * @param {JohnTravoltageModel} model
   * @param {function} addStepListener
   * @param {Tandem} tandem
   * @constructor
   */
  function SparkNode( model, addStepListener, tandem ) {
    var self = this;

    Node.call( this, { pickable: false, tandem: tandem } );

    model.sparkVisibleProperty.linkAttribute( this, 'visible' );
    var whitePath = new Path( null, { stroke: 'white', lineWidth: 4 } );
    var bluePath = new Path( null, { stroke: 'blue', lineWidth: 1 } );
    this.addChild( whitePath );
    this.addChild( bluePath );

    var numSegments = 10;
    addStepListener( function() {
      if ( self.visible ) {
        var shape = new Shape();

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

            // go 1/numSegments of the remaining distance to the target, in a direction roughly toward the target
            var delta = model.doorknobPosition.minus( point ).normalized().timesScalar( segmentLength );
            delta = delta.rotated( phet.joist.random.nextDouble() - 0.5 );
            point = point.plus( delta );
          }

          shape.lineToPoint( point );
        }

        whitePath.shape = shape;
        bluePath.shape = shape;
      }
    } );
  }

  johnTravoltage.register( 'SparkNode', SparkNode );

  return inherit( Node, SparkNode );
} );
