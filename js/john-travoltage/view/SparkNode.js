// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the spark of the model.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  /**
   * Constructor for the SparkNode, which shows the animated spark from the finger to the doorknob when electrons are flowing out.
   *
   * @param {Property<Boolean>} sparkVisibleProperty true if the spark should be shown
   * @param {Arm} arm the arm the electrons will flow through
   * @param {Vector2} doorknobPosition the position of the doorknob
   * @param {Function} addStepListener function to add a step listener to the model
   * @constructor
   */
  function SparkNode( sparkVisibleProperty, arm, doorknobPosition, addStepListener, dischargeAlertText, options ) {
    var self = this;
    var alertNode = document.getElementById( options.peerID );

    Node.call( this, { pickable: false } );

    sparkVisibleProperty.linkAttribute( this, 'visible' );
    var whitePath = new Path( null, { stroke: 'white', lineWidth: 4 } );
    var bluePath = new Path( null, { stroke: 'blue', lineWidth: 1 } );
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

        if (alertNode && !alertNode.textContent) {
          alertNode.textContent = dischargeAlertText;
          alertNode.style.display = 'block';
        }
      } else if (alertNode) {
        alertNode.style.display = 'none';
        alertNode.textContent = '';
      }
    } );
  }

  johnTravoltage.register( 'SparkNode', SparkNode );

  return inherit( Node, SparkNode );
} );
