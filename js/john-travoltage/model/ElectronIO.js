// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Electron
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
   * @param {Electron} electron
   * @param {Object} stateObject
   */
  static applyState( electron, stateObject ) {
    validate( electron, this.validator );
    assert && assert( stateObject.history, 'value should have history' );
    electron.history = stateObject.history;
    electron.velocity.x = stateObject.velocityX;
    electron.velocity.y = stateObject.velocityY;

    // Trigger a computation of screen position
    electron.historyChangedEmitter.emit();
  }
}

ElectronIO.validator = { isValidValue: v => v instanceof phet.johnTravoltage.Electron };
ElectronIO.documentation = 'Electron in John\'s body';
ElectronIO.typeName = 'ElectronIO';
ObjectIO.validateIOType( ElectronIO );

johnTravoltage.register( 'ElectronIO', ElectronIO );
export default ElectronIO;