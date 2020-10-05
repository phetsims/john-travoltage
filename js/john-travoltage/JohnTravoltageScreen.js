// Copyright 2013-2020, University of Colorado Boulder

/**
 * Screen for John Travoltage
 *
 * @author Sam Reid
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import johnTravoltage from '../johnTravoltage.js';
import JohnTravoltageModel from './model/JohnTravoltageModel.js';
import JohnTravoltageKeyboardHelpContent from './view/JohnTravoltageKeyboardHelpContent.js';
import JohnTravoltageView from './view/JohnTravoltageView.js';

class JohnTravoltageScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super(
      function() {
        return new JohnTravoltageModel( tandem.createTandem( 'model' ) );
      },
      function( model ) {
        return new JohnTravoltageView( model, tandem.createTandem( 'view' ) );
      }, {
        backgroundColorProperty: new Property( '#9ddcf8' ),
        tandem: tandem,
        keyboardHelpNode: new JohnTravoltageKeyboardHelpContent()
      }
    );
  }
}

johnTravoltage.register( 'JohnTravoltageScreen', JohnTravoltageScreen );
export default JohnTravoltageScreen;