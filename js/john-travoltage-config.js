// Copyright 2002-2013, University of Colorado Boulder

/**
 * RequireJS configuration file for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
require.config( {
  // An array of dependencies to load. Useful when require is defined as a config object before require.js
  // is loaded, and you want to specify dependencies to load as soon as require() is defined.
  deps: ['john-travoltage-main'],

  // baseUrl: don't bother trying to set it here, it is overridden by data-main in the top-level HTML file

  // Path mappings for module names not found directly under baseUrl. The path settings are assumed to be
  // relative to baseUrl unless the paths setting starts with a '/' or has a URL protocol.
  paths: {

    // this sim
    JOHN_TRAVOLTAGE: '.',

    // PhET libs, uppercase names to identify them in require imports
    PHETCOMMON: '../../phetcommon/js',
    SCENERY: '../../scenery/js',
    SCENERY_PHET: '../../scenery-phet/js',
    KITE: '../../kite/js',
    PHET_CORE: '../../phet-core/js',
    DOT: '../../dot/js',
    AXON: '../../axon/js',
    BRAND: '../../brand/js',
    SUN: '../../sun/js',
    JOIST: '../../joist/js',
    VIBE: '../../vibe/js',
    SHERPA: '../../sherpa',

    // PhET plugins
    image: '../../chipper/requirejs-plugins/image',
    audio: '../../chipper/requirejs-plugins/audio',
    string: '../../chipper/requirejs-plugins/string',

    // third-party libs
    text: '../../sherpa/text'
  },

  urlArgs: new Date().getTime()  // cache buster to make browser reload all included scripts
} );
