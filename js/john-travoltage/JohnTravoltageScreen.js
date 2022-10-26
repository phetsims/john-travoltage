// Copyright 2013-2022, University of Colorado Boulder

/**
 * Screen for John Travoltage
 *
 * @author Sam Reid (PhET Interactive Simulations)
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
      () => new JohnTravoltageModel( tandem.createTandem( 'model' ) ),
      model => new JohnTravoltageView( model, tandem.createTandem( 'view' ) ), {
        backgroundColorProperty: new Property( '#E4D8C2' ),
        tandem: tandem,
        createKeyboardHelpNode: () => new JohnTravoltageKeyboardHelpContent()
      }
    );
  }
}

johnTravoltage.register( 'JohnTravoltageScreen', JohnTravoltageScreen );
export default JohnTravoltageScreen;