// Copyright 2013-2019, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the spark of the model.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */

import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import johnTravoltage from '../../johnTravoltage.js';

/**
 * Constructor for the SparkNode, which shows the animated spark from the finger to the doorknob when electrons are flowing out.
 *
 * @param {JohnTravoltageModel} model
 * @param {function} addStepListener
 * @param {Tandem} tandem
 * @constructor
 */
function SparkNode( model, addStepListener, tandem ) {
  const self = this;

  Node.call( this, { pickable: false, tandem: tandem } );

  model.sparkVisibleProperty.linkAttribute( this, 'visible' );
  const whitePath = new Path( null, { stroke: 'white', lineWidth: 4 } );
  const bluePath = new Path( null, { stroke: 'blue', lineWidth: 1 } );
  this.addChild( whitePath );
  this.addChild( bluePath );

  const numSegments = 10;
  addStepListener( function() {
    if ( self.visible ) {
      const shape = new Shape();

      let point = model.arm.getFingerPosition();
      shape.moveToPoint( point );
      const distanceToTarget = model.doorknobPosition.distance( point );
      let segmentLength = distanceToTarget / numSegments;
      for ( let i = 0; i < numSegments; i++ ) {
        if ( i === numSegments - 1 ) {
          segmentLength = distanceToTarget;
          point = model.doorknobPosition;
        }
        else {

          // go 1/numSegments of the remaining distance to the target, in a direction roughly toward the target
          let delta = model.doorknobPosition.minus( point ).normalized().timesScalar( segmentLength );
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

inherit( Node, SparkNode );
export default SparkNode;