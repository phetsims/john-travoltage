// Copyright 2013-2022, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the spark of the model.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import johnTravoltage from '../../johnTravoltage.js';

class SparkNode extends Node {

  /**
   * Constructor for the SparkNode, which shows the animated spark from the finger to the doorknob when electrons are flowing out.
   *
   * @param {JohnTravoltageModel} model
   * @param {function} addStepListener
   * @param {Tandem} tandem
   */
  constructor( model, addStepListener, tandem ) {

    super( { pickable: false, tandem: tandem } );

    model.sparkVisibleProperty.linkAttribute( this, 'visible' );
    const whitePath = new Path( null, { stroke: 'white', lineWidth: 4 } );
    const bluePath = new Path( null, { stroke: 'blue', lineWidth: 1 } );
    this.addChild( whitePath );
    this.addChild( bluePath );

    const numSegments = 10;
    addStepListener( () => {
      if ( this.visible ) {
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
            delta = delta.rotated( dotRandom.nextDouble() - 0.5 );
            point = point.plus( delta );
          }

          shape.lineToPoint( point );
        }

        whitePath.shape = shape;
        bluePath.shape = shape;
      }
    } );
  }
}

johnTravoltage.register( 'SparkNode', SparkNode );

export default SparkNode;