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

  // strings
  var footOnCarpetString = require( 'string!JOHN_TRAVOLTAGE/foot.onCarpet' );
  var footOffCarpetString = require( 'string!JOHN_TRAVOLTAGE/foot.offCarpet' );
  var handClosestString = require( 'string!JOHN_TRAVOLTAGE/hand.closest' );
  var handVeryCloseString = require( 'string!JOHN_TRAVOLTAGE/hand.veryClose' );
  var handCloseString = require( 'string!JOHN_TRAVOLTAGE/hand.close' );
  var handNeitherString = require( 'string!JOHN_TRAVOLTAGE/hand.neither' );
  var handFarString = require( 'string!JOHN_TRAVOLTAGE/hand.far' );
  var handVeryFarString = require( 'string!JOHN_TRAVOLTAGE/hand.veryFar' );
  var handFarthestString = require( 'string!JOHN_TRAVOLTAGE/hand.farthest' );

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
