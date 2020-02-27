// Copyright 2013-2019, University of Colorado Boulder

/**
 * Screen for John Travoltage
 *
 * @author Sam Reid
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import johnTravoltage from '../johnTravoltage.js';
import JohnTravoltageModel from './model/JohnTravoltageModel.js';
import JohnTravoltageView from './view/JohnTravoltageView.js';

/**
 * @param tandem
 * @constructor
 */
function JohnTravoltageScreen( tandem ) {
  Screen.call( this,
    function() {
      return new JohnTravoltageModel( tandem.createTandem( 'model' ) );
    },
    function( model ) {
      return new JohnTravoltageView( model, tandem.createTandem( 'view' ) );
    }, {
      backgroundColorProperty: new Property( '#9ddcf8' ),
      tandem: tandem
    }
  );
}

johnTravoltage.register( 'JohnTravoltageScreen', JohnTravoltageScreen );

inherit( Screen, JohnTravoltageScreen );
export default JohnTravoltageScreen;