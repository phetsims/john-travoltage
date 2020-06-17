// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for Electron
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import johnTravoltage from '../../johnTravoltage.js';

class ElectronIO extends ObjectIO {


  /**
   * @public
   * @param {Electron} electron
   * @returns {Object}
   * @override
   */
  static toStateObject( electron ) {
    validate( electron, this.validator );
    return {
      history: electron.history,
      velocityX: electron.velocity.x,
      velocityY: electron.velocity.y
    };
  }

  /**
   * @public
   * @param {Object} stateObject
   * @returns {Object}
   * @override
   */
  static fromStateObject( stateObject ) {
    return stateObject;
  }

  /**
   * @public
   * @param {Electron} electron
   * @param {Object} fromStateObject
   */
  static applyState( electron, fromStateObject ) {
    validate( electron, this.validator );
    assert && assert( fromStateObject.history, 'value should have history' );
    electron.history = fromStateObject.history;
    electron.velocity.x = fromStateObject.velocityX;
    electron.velocity.y = fromStateObject.velocityY;

    // Trigger a computation of screen position
    electron.historyChangedEmitter.emit();
  }
}

ElectronIO.validator = { isValidValue: v => v instanceof phet.johnTravoltage.Electron };
ElectronIO.documentation = 'Electron in John\'s body';
ElectronIO.typeName = 'ElectronIO';
ObjectIO.validateSubtype( ElectronIO );

johnTravoltage.register( 'ElectronIO', ElectronIO );
export default ElectronIO;