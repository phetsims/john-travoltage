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

    leg: [
      {
        range: {
          max: 5,
          min: 0
        },
        text: footOffCarpetString
      }, {
        range: {
          max: 21,
          min: 6
        },
        text: footOnCarpetString
      }, {
        range: {
          max: 30,
          min: 22
        },
        text: footOffCarpetString
      }
    ],

    arm: [
      {
        range: {
          max: 0,
          min: 0
        },
        text: handFarthestString
      }, {
        range: {
          max: 12,
          min: 1
        },
        text: handVeryFarString
      }, {
        range: {
          max: 24,
          min: 13
        },
        text: handFarString
      }, {
        range: {
          max: 25,
          min: 25
        },
        text: handNeitherString
      }, {
        range: {
          max: 37,
          min: 26
        },
        text: handCloseString
      }, {
        range: {
          max: 49,
          min: 38
        },
        text: handVeryCloseString
      }, {
        range: {
          max: 50,
          min: 50
        },
        text: handClosestString
      }, {
        range: {
          max: 62,
          min: 51
        },
        text: handVeryCloseString
      }, {
        range: {
          max: 74,
          min: 63
        },
        text: handCloseString
      }, {
        range: {
          max: 75,
          min: 75
        },
        text: handNeitherString
      }, {
        range: {
          max: 87,
          min: 76
        },
        text: handFarString
      }, {
        range: {
          max: 99,
          min: 88
        },
        text: handVeryFarString
      }, {
        range: {
          max: 100,
          min: 100
        },
        text: handFarthestString
      }
    ]
  };

  johnTravoltage.register( 'AppendageRangeMaps', AppendageRangeMaps );

  return AppendageRangeMaps;
} );
