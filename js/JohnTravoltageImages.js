// Copyright 2002-2013, University of Colorado Boulder

/**
 * Image loader for this simulation.
 * <p>
 * This object will be extended lazily after the image loader completes.
 * Makes it possible to load through the module system rather having to
 * pass as a parameter everywhere or resort to using a global.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  'use strict';

  return {
    imageNames: ['wallpaper.png', 'arm.png', 'leg.png', 'window.svg', 'rug.svg', 'door.svg', 'body.png', 'floor.png', 'reset_button_disabled.png',
      'reset_button_down.png', 'reset_button_over.png', 'reset_button_up.png']
  };
} );