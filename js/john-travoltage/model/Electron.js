// Copyright 2013-2022, University of Colorado Boulder

/**
 * Model for the electrons that are absorbed from the carpet and discharged into the doorknob.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import johnTravoltage from '../../johnTravoltage.js';

//If this value is 1.0, there is no friction.  The value is what the velocity is multiplied by at every step.
const frictionFactor = 0.98;

let electronCount = 0;

class Electron extends PhetioObject {

  /**
   * @param {number} x
   * @param {number} y
   * @param {JohnTravoltageModel} model
   * @param {Object} [options] - required for tandem
   */
  constructor( x, y, model, options ) {
    options = merge( {

      //{Tandem}
      tandem: Tandem.REQUIRED,
      phetioType: Electron.ElectronIO,
      phetioDynamicElement: true
    }, options );
    super( options );
    const tandem = options.tandem;
    electronCount++;
    this.id = electronCount;
    this.positionProperty = new Vector2Property( new Vector2( x, y ), {
      tandem: tandem.createTandem( 'positionProperty' )
    } );

    //The velocity an electron has when it comes from the carpet into the leg.
    this.velocity = new Vector2( -50, -100 );
    this.model = model;
    this.exiting = false;//mutable but not observable

    //Segment the electron is traveling towards
    this.segment = null;

    //Store some values that are used in an inner loop
    this.maxSpeed = 500;
    this.maxForceSquared = 100000000;

    // @public (phet-io) the history of body positions, 'arm', 'leg' and 'body' for rendering in the correct place
    this.history = [];

    // @public (phet-io) when the history changes, the electron's screen position is recomputed
    this.historyChangedEmitter = new Emitter();

    //Electrons start in the leg
    for ( let i = 0; i < 10; i++ ) {
      this.history.push( 'leg' );
    }

    this.disposeElectron = () => {
      this.positionProperty.dispose();
    };
  }


  /**
   * Step function for when the electron is exiting the body (discharging).  Electrons leave the body through
   * a spark.
   * @private
   * @param  {number} dt - in seconds
   */
  stepInSpark( dt ) {
    //move to the closest line segment
    if ( !this.segment ) {

      this.segment = _.minBy( this.model.forceLines, forceLine => forceLine.p0.distanceSquared( this.positionProperty.get() ) );

      //If the closest path is the same as the last one, it means we have reached the end of the road
      if ( this.lastSegment === this.segment ) {

        //Don't remove immediately or it will be concurrentmodificationexception in iterator
        this.model.electronsToRemove.push( this );
        return;
      }
    }
    //move at constant velocity toward the segment
    const target = this.segment.p1;
    const current = this.positionProperty.get();
    const delta = target.minus( current );

    //Arrived at destination, go to the next segment
    if ( delta.magnitude <= 100 * dt ) {
      this.lastSegment = this.segment;
      this.segment = null;
    }
    else {

      //Send toward the end point on the segment, but with some randomness to make it look more realistic.
      //If the electron moves outside the body, it will be corrected in JohnTravoltageModel.moveElectronInsideBody
      this.velocity.set( Vector2.createPolar( 200, delta.angle + ( dotRandom.nextDouble() - 0.5 ) ) );
      this.positionProperty.set( this.velocity.timesScalar( dt ).plus( this.positionProperty.get() ) );
    }
  }

  /**
   * Step function for an electron.
   * @param  {number} dt - in seconds
   * @public
   */
  step( dt ) {
    if ( this.exiting ) {
      this.stepInSpark( dt );
    }
    else {
      this.stepInBody( dt );
    }
  }

  /**
   * Make eligible for garbage collection.
   * @public
   */
  dispose() {
    this.disposeElectron();
    super.dispose();
  }

  /**
   * Step function for the electron when it is moving through the body (not discharging). Electrons in the body
   * will 'bounce' and 'repel' away from each other.  The result is that they will spread uniformily throughout
   * the body and do so in a dynamically appealing way.
   * @param  {number} dt - in seconds
   * @public
   */
  stepInBody( dt ) {

    //Performance is critical in this method, so avoid es5 which can be slower
    const position = this.positionProperty.get();

    const x1 = position.x;
    const y1 = position.y;

    let netForceX = 0;
    let netForceY = 0;

    // Compute the net force on each electron from pairwise repulsion.  This stabilizes the motion and pushes
    // the electrons to the outer boundary of the bodies
    // This is an expensive O(n^2) inner loop, so highly optimized and uses Number instead of Vector2 in a number of locations
    const length = this.model.electronGroup.count;
    for ( let i = 0; i < length; i++ ) {
      const electron = this.model.electronGroup.getElement( i );

      // Skipping some interactions speeds things up and also gives a good sense of more randomness
      if ( electron !== this && dotRandom.nextDouble() < 0.4 ) {

        //Using direct get method instead of ES5 getter to improve performance in this inner loop
        //ES5 getter shows up as expensive in this inner loop (7% out of 30%), so skip it and only get the position once
        const electronPosition = electron.positionProperty.get();

        const deltaVectorX = electronPosition.x - position.x;
        const deltaVectorY = electronPosition.y - position.y;

        //If the electrons are directly on top of one another (can be caused by moving them inside the body bounds when a spark is cancelled), then skip this computation
        if ( deltaVectorX && deltaVectorY ) {

          //Good luck tuning these magic numbers!
          //Tuning the power to a smaller number increases long range interactions.
          //Tuning the coefficient to a higher number increases the strength of interaction at any distance.
          const scale = 12000 / Math.pow( electronPosition.distance( position ), 3 );
          let fx = deltaVectorX * scale;
          let fy = deltaVectorY * scale;
          const forceMagnitudeSquared = fx * fx + fy * fy;
          if ( forceMagnitudeSquared > this.maxForceSquared ) {
            fx = fx / this.maxForceSquared;
            fy = fy / this.maxForceSquared;
          }
          netForceX = netForceX - fx;
          netForceY = netForceY - fy;
        }
      }
    }

    let vx2 = this.velocity.x + netForceX * dt;
    let vy2 = this.velocity.y + netForceY * dt;

    const d = Math.sqrt( vx2 * vx2 + vy2 * vy2 );

    if ( d > this.maxSpeed ) {
      vx2 = vx2 / d * this.maxSpeed;
      vy2 = vy2 / d * this.maxSpeed;
    }
    vx2 = vx2 * frictionFactor;
    vy2 = vy2 * frictionFactor;

    const x2 = x1 + vx2 * dt;
    const y2 = y1 + vy2 * dt;

    // Skipping notifications here because nobody needs to observe the velocity values, and this is faster (no allocation)
    this.velocity.setXY( vx2, vy2 );

    const segments = this.model.lineSegments;
    const numSegments = segments.length;
    let bounced = false;
    for ( let i = 0; i < numSegments; i++ ) {
      const segment = segments[ i ];
      if ( Utils.lineSegmentIntersection( x1, y1, x2, y2, segment.x1, segment.y1, segment.x2, segment.y2 ) ) {

        const normal = segment.normalVector;

        // reflect velocity, but lose some of the energy in the bounce to help keep the electrons near the walls and help them lose energy quicker
        // The Safari 6.0 heisenbug exhibits here if you use es5, so use property.get() instead
        this.velocity.set( this.velocity.minus( normal.times( 2 * normal.dot( this.velocity ) ) ).timesScalar( 0.8 ) );
        bounced = true;
        break;
      }
    }

    // See if it crossed a barrier, and reflect it
    if ( !bounced ) {

      // Note, this does not send notifications because it is setting the x,y values on the vector itself
      this.positionProperty.set( new Vector2( x2, y2 ) );
    }
    else {

      // Notify observers anyways so the electron will redraw at the right leg angle
      this.positionProperty.notifyListenersStatic();
    }
  }
}

//Radius of the electron
Electron.radius = 8;

Electron.ElectronIO = new IOType( 'ElectronIO', {
  valueType: Electron,
  documentation: 'Electron in John\'s body',
  toStateObject: electron => ( {
    history: electron.history,
    velocityX: electron.velocity.x,
    velocityY: electron.velocity.y
  } ),
  stateSchema: {
    history: ArrayIO( StringIO ),
    velocityX: NumberIO,
    velocityY: NumberIO
  },
  applyState: ( electron, stateObject ) => {
    assert && assert( stateObject.history, 'value should have history' );
    electron.history = stateObject.history;
    electron.velocity.x = stateObject.velocityX;
    electron.velocity.y = stateObject.velocityY;

    // Trigger a computation of screen position
    electron.historyChangedEmitter.emit();
  }
} );

johnTravoltage.register( 'Electron', Electron );

export default Electron;