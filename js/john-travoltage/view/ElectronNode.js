// Copyright 2013-2022, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for minusCharge. All electron nodes use a single image node, and are added
 * to the scene graph using Scenery's DAG feature.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */

import DotRectangle from '../../../../dot/js/Rectangle.js'; // eslint-disable-line default-import-match-filename
import Vector2 from '../../../../dot/js/Vector2.js';
import ElectronChargeNode from '../../../../scenery-phet/js/ElectronChargeNode.js';
import { Circle, Image, Node, Rectangle } from '../../../../scenery/js/imports.js';
import johnTravoltage from '../../johnTravoltage.js';

// constants
// Scale up before rasterization so it won't be too pixelated/fuzzy
const scale = 2;

// single node for all electrons, making use of scenery's DAG feature
const minusChargeNode = new ElectronChargeNode( { scale: scale, top: 0, left: 0 } );

const node = new Node();
minusChargeNode.toImage( im => {

  //Scale back down so the image will be the desired size
  node.children = [ new Image( im, { scale: 1.0 / scale } ) ];
}, 0, 0, minusChargeNode.width, minusChargeNode.height );

//Bounds for the leg and arm regions sampled by clicking on the JohnTravoltageView coordinates
const legBounds = new DotRectangle( 368.70275791624107, 332.0122574055158, 600, 600 );
let armBounds = new DotRectangle( 427.41602634467614, 210.03732162458834, 70, 42 );

const topLeft = new Vector2( 427.83601359003404, 154.03488108720273 );
const bottomRight = new Vector2( 558.1263873159684, 294.67542468856175 );
armBounds = new DotRectangle( topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y );

//Precompute and reuse to avoid allocations
const a = new Vector2( 0, 0 );
const b = new Vector2( 0, 0 );
let dr = new Vector2( 0, 0 );

const debugPosition = false;

class ElectronNode extends Node {

  /**
   * @param {Electron} electron
   * @param {Leg} leg
   * @param {Arm} arm
   */
  constructor( electron, leg, arm ) {
    super( {
      pickable: false
    } );

    this.addChild( node );
    node.centerX = 0;
    node.centerY = 0;
    if ( debugPosition ) {
      const circle = new Circle( 2, { fill: 'yellow' } );
      circle.centerX = 0;
      circle.centerY = 0;
      this.addChild( circle );

      this.addChild( new Rectangle( node.bounds, { lineWidth: 1, stroke: 'red' } ) );
    }

    // For debugging, show the electron id
    // this.addChild( new Text( '' + electron.id, {fill: 'white'} ) );

    const legText = 'leg';
    const bodyText = 'body';
    const armText = 'arm';

    //Electrons fire a position changed every step whether their position changed or not, so that it will still be drawn in the proper place if the leg angle changed.
    const updatePosition = position => {

      electron.history.push( legBounds.containsPoint( position ) ? legText :
                             armBounds.containsPoint( position ) ? armText :
                             bodyText );
      if ( electron.history.length > 10 ) {
        electron.history.shift();
      }

      let inLegCount = 0;
      let inBodyCount = 0;
      let inArmCount = 0;
      let deltaAngle;
      let c;
      for ( let i = 0; i < electron.history.length; i++ ) {
        const element = electron.history[ i ];
        if ( element === legText ) {
          inLegCount++;
        }
        else if ( element === armText ) {
          inArmCount++;
        }
        else {
          inBodyCount++;
        }
      }

      //Simplest case, it wasn't in any appendage
      if ( inBodyCount === electron.history.length ) {
        this.setTranslation( position.x, position.y );
      }

      else if ( inLegCount >= inArmCount ) {

        // Interpolate for smoothness at intersection between leg/body
        const legPoint = leg.position;

        dr.setXY( position.x - legPoint.x, position.y - legPoint.y );

        //The leg's rotated angle
        deltaAngle = leg.deltaAngle();
        dr = dr.rotated( deltaAngle ).plus( legPoint );

        //No need to blend, it was in the leg the whole time
        if ( inLegCount === electron.history.length ) {
          this.setTranslation( dr.x, dr.y );
        }
        else {
          a.setXY( dr.x, dr.y );
          b.setXY( position.x, position.y );
          c = a.blend( b, inBodyCount / electron.history.length );
          this.setTranslation( c.x, c.y );
        }
      }

      //This assumes that no electron will blend arm/leg positions, which is a fair assumption since it is difficult to get from the leg to the arm in only 10 history steps
      else {

        const armPoint = arm.position;

        dr.setXY( position.x - armPoint.x, position.y - armPoint.y );

        //The leg's rotated angle
        deltaAngle = arm.angleProperty.get();
        dr = dr.rotated( deltaAngle ).plus( armPoint );

        //No need to blend, it was in the leg the whole time
        if ( inArmCount === electron.history.length ) {
          this.setTranslation( dr.x, dr.y );
        }
        else {
          a.setXY( dr.x, dr.y );
          b.setXY( position.x, position.y );
          c = a.blend( b, inBodyCount / electron.history.length );
          this.setTranslation( c.x, c.y );
        }
      }

    };
    electron.positionProperty.link( updatePosition );

    const updatePositionBound = () => {
      updatePosition( electron.positionProperty.get() );
    };
    electron.historyChangedEmitter.addListener( updatePositionBound );

    const disposeListener = () => {
      this.dispose();
    };
    electron.disposeEmitter.addListener( disposeListener );

    this.disposeElectronNode = () => {
      electron.positionProperty.unlink( updatePosition );
      electron.historyChangedEmitter.removeListener( updatePositionBound );
      electron.disposeEmitter.removeListener( disposeListener );
    };
  }


  /**
   * Make eligible for garbage collection.
   * @public
   */
  dispose() {
    this.disposeElectronNode();
    super.dispose();
  }
}

johnTravoltage.register( 'ElectronNode', ElectronNode );

export default ElectronNode;