// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Electron
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import johnTravoltage from '../../johnTravoltage.js';

const ElectronIO = new IOType( 'ElectronIO', {
  isValidValue: v => v instanceof phet.johnTravoltage.Electron,
  documentation: 'Electron in John\'s body',

  /**
   * @public
   * @param {Electron} electron
   * @returns {Object}
   * @override
   */
  toStateObject( electron ) {
    return {
      history: electron.history,
      velocityX: electron.velocity.x,
      velocityY: electron.velocity.y
    };
  },

  /**
   * @public
   * @param {Electron} electron
   * @param {Object} stateObject
   */
  applyState( electron, stateObject ) {
    assert && assert( stateObject.history, 'value should have history' );
    electron.history = stateObject.history;
    electron.velocity.x = stateObject.velocityX;
    electron.velocity.y = stateObject.velocityY;

    // Trigger a computation of screen position
    electron.historyChangedEmitter.emit();
  }
} );

johnTravoltage.register( 'ElectronIO', ElectronIO );
export default ElectronIO;