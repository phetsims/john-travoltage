// Copyright 2016, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * RangeMaps used by the AppendageNodes to associate a position with a position description.
 *
 * @author Justin Obara
 */
define( function( require ) {
  'use strict';

  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var Range = require( 'DOT/Range' );

  // strings - a11y strings should NOT be translatable yet
  // see https://github.com/phetsims/john-travoltage/issues/130
  var footOnCarpetString = JohnTravoltageA11yStrings.footOnCarpetString;
  var footOffCarpetString = JohnTravoltageA11yStrings.footOffCarpetString;
  var handClosestString = JohnTravoltageA11yStrings.handClosestString;
  var handVeryCloseString = JohnTravoltageA11yStrings.handVeryCloseString;
  var handCloseString = JohnTravoltageA11yStrings.handCloseString;
  var handNeitherString = JohnTravoltageA11yStrings.handNeitherString;
  var handFarString = JohnTravoltageA11yStrings.handFarString;
  var handVeryFarString = JohnTravoltageA11yStrings.handVeryFarString;
  var handFarthestString = JohnTravoltageA11yStrings.handFarthestString;

  var AppendageRangeMaps = {

    legMap: {
      regions: [
        {
          range: new Range( 0, 5 ),
          text: footOffCarpetString
        }, {
          range: new Range( 6, 21 ),
          text: footOnCarpetString
        }, {
          range: new Range( 22, 30 ),
          text: footOffCarpetString
        }
      ],
      landmarks: {}
    },

    armMap: {
      regions: [
        {
          range: new Range( 0, 0 ),
          text: handFarthestString
        }, {
          range: new Range( 1, 12 ),
          text: handVeryFarString
        }, {
          range: new Range( 13, 24 ),
          text: handFarString
        }, {
          range: new Range( 25, 25 ),
          text: handNeitherString
        }, {
          range: new Range( 26, 37 ),
          text: handCloseString
        }, {
          range: new Range( 38, 49 ),
          text: handVeryCloseString
        }, {
          range: new Range( 50, 50 ),
          text: handClosestString
        }, {
          range: new Range( 51, 62 ),
          text: handVeryCloseString
        }, {
          range: new Range( 63, 74 ),
          text: handCloseString
        }, {
          range: new Range( 75, 75 ),
          text: handNeitherString
        }, {
          range: new Range( 76, 87 ),
          text: handFarString
        }, {
          range: new Range( 88, 99 ),
          text: handVeryFarString
        }, {
          range: new Range( 100, 100 ),
          text: handFarthestString
        }
      ]
    }
  };

  johnTravoltage.register( 'AppendageRangeMaps', AppendageRangeMaps );

  return AppendageRangeMaps;
} );
