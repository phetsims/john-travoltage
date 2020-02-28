// Copyright 2019-2020, University of Colorado Boulder

/**
 * A way to visualize haptic feedback. This is an icon that looks like a phone with zig zag lines around it to
 * represent vibration. When vibrating, the zig zags are visible and jostle around and the phone screen turns
 * a different color.
 *
 * @author Jesse Greenberg
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import johnTravoltage from '../../johnTravoltage.js';

class VibrationIndicator extends Node {

  /**
   * @param {BooleanProperty} vibratingProperty - vibration running?
   */
  constructor( vibratingProperty ) {
    super();

    // @private {NumberProperty} - elapsed time for animation
    this.timeProperty = new NumberProperty( 0 );

    // @private
    this.vibratingProperty = vibratingProperty;

    // draw a phone
    const phoneBody = new Rectangle( 0, 0, 40, 75, 4, 4, { fill: 'white' } );
    const screen = new Rectangle( 0, 0, phoneBody.width - 5, phoneBody.height - 20, {
      fill: 'white',
      center: phoneBody.center
    } );
    const homeButton = new Circle( 2, {
      fill: 'black',
      center: phoneBody.centerBottom.minusXY( 0, 5 )
    } );
    const speaker = new Rectangle( 0, 0, phoneBody.width * 0.35, phoneBody.height * 0.03, 4, 4, {
      fill: 'black',
      center: phoneBody.centerTop.plusXY( 0, 5 )
    } );
    phoneBody.addChild( screen );
    phoneBody.addChild( homeButton );
    phoneBody.addChild( speaker );

    // vibration indicators
    const vibrationShape = new Shape();
    vibrationShape.moveTo( 0, 0 );
    vibrationShape.zigZagTo( 0, screen.height, phoneBody.width * 0.10, 3, true );

    const leftVibrationCenter = phoneBody.leftCenter.minusXY( 8, 0 );
    const rightVibrationCenter = phoneBody.rightCenter.plusXY( 8, 0 );

    this.leftVibrationPath = new Path( vibrationShape, {
      stroke: 'orange',
      lineWidth: 4,
      rightCenter: leftVibrationCenter
    } );
    this.leftVibrationPath.setScaleMagnitude( -1, 1 );

    this.rightVibrationPath = new Path( vibrationShape, {
      stroke: 'orange',
      lineWidth: 4,
      leftCenter: rightVibrationCenter
    } );

    phoneBody.addChild( this.leftVibrationPath );
    phoneBody.addChild( this.rightVibrationPath );

    const panel = new Rectangle( 0, 0, phoneBody.width, phoneBody.height + 10, 5, 5, {
      fill: 'black'
    } );
    phoneBody.center = panel.center;
    panel.addChild( phoneBody );

    this.addChild( panel );

    this.vibratingProperty.link( vibrating => {
      screen.fill = vibrating ? 'lightblue' : 'grey';

      this.leftVibrationPath.visible = vibrating;
      this.rightVibrationPath.visible = vibrating;

      // when vibration stops, reset the vibration icons back to their initial positions
      this.leftVibrationPath.center = leftVibrationCenter;
      this.rightVibrationPath.center = rightVibrationCenter;
    } );
  }

  /**
   * Animate the indicator if vibrating.
   *
   * @param {number} dt
   */
  step( dt ) {
    this.timeProperty.set( this.timeProperty.get() + dt );

    if ( this.vibratingProperty.get() ) {
      const xJostle = -Math.sin( this.timeProperty.get() * 70 );
      const yJostle = 0.5 * Math.sin( this.timeProperty.get() * 10 );

      this.rightVibrationPath.translate( xJostle, yJostle );
      this.leftVibrationPath.translate( xJostle, yJostle );
    }
  }
}

johnTravoltage.register( 'VibrationIndicator', VibrationIndicator );
export default VibrationIndicator;