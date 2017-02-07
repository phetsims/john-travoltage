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
  var AriaHerald = require( 'SCENERY_PHET/accessibility/AriaHerald' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );

  /**
   * Constructor for the SparkNode, which shows the animated spark from the finger to the doorknob when electrons are flowing out.
   *
   * @param {JohnTravoltageModel} model
   * @param {function} addStepListener
   * @constructor
   */
  function SparkNode( model, addStepListener ) {
    var self = this;

    Node.call( this, { pickable: false } );

    model.sparkVisibleProperty.linkAttribute( this, 'visible' );
    var whitePath = new Path( null, { stroke: 'white', lineWidth: 4 } );
    var bluePath = new Path( null, { stroke: 'blue', lineWidth: 1 } );
    this.addChild( whitePath );
    this.addChild( bluePath );

    // a11y - whenever a discharge starts, announce as an alert
    // spark node is created once, no need to dispose
    model.dischargeStartedEmitter.addListener( function() {
      AriaHerald.announceAssertiveWithAlert( JohnTravoltageA11yStrings.electronsDischargedString, true );
    } );

    // clear alert content so that it cannot be found with the virtual cursor when discharge is finished
    // spark node is created once, no need to dispose
    model.dischargeEndedEmitter.addListener( function() {
      AriaHerald.clearAssertiveWithAlert();
    } );

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

            //go 1/numSegments of the remaining distance to the target, in a direction roughly toward the target
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
