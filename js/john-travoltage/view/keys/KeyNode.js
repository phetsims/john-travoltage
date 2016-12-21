// Copyright 2016, University of Colorado Boulder

/**
 * A node that looks like a keyboard key.  Has a shadow rectangle under the key
 * icon with a slight offset so that it has a slight 3D appearance.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Node = require( 'SCENERY/nodes/Node' );

  // constants
  // valid values for options.align
  var ALIGN_VALUES = [ 'leftTop', 'leftCenter', 'leftBottom', 'centerTop', 'center', 'centerBottom', 'rightTop', 'rightCenter', 'rightBottom' ];

  var DEFAULT_OPTIONS = {

    // color and styling
    keyFill: 'white',
    keyShadowFill: 'black',
    lineWidth: 1, // line width for the key button
    cornerRadius: 3, // corner radius applied to the key and its shadow

    // offset for the shadow rectangle relative to the top left corner of the key
    xShadowOffset: 2,
    yShadowOffset: 2,

    // margins
    xOffset: 0, // margin from the left/right edge of key depending on alignment
    yOffset: 0, // margin from the top/bottom edge of key depending on alignment

    // All alignments are equal when the content width >= minKeyWidth
    // Center is the default alignment so the icon content will be aligned in the center of the key
    align: 'center',

    // by default the max and min widths are the same so that the icon size does not
    // change the size of the key
    minKeyWidth: 32, // minimum width of the key
    minKeyHeight: 32, // min height of the key

    maxKeyWidth: 32, // max width of the key, will apply scaling to the icon
    maxKeyHeight: 32 // max height of key, will apply scalking to the icon 
  };

  /**
   * Constructor.
   * @param {Node} keyIcon - icon placed in the key
   * @param {Object} options
   */
  function KeyNode( keyIcon, options ) {

    options = _.extend( {}, DEFAULT_OPTIONS, options );
    assert && assert( _.contains( ALIGN_VALUES, options.align ), 'invalid align: ' + options.align );
    assert && assert( options.minKeyWidth <= options.maxKeyWidth, 'max key width must be greater than min key width' );
    assert && assert( options.minKeyHeight <= options.maxKeyHeight, 'max key height must be greater than min key height' );

    // the key will be at least this wide and tall
    var minKeyWidth = Math.max( options.minKeyWidth, keyIcon.width );
    var minKeyHeight = Math.max( options.minKeyHeight, keyIcon.height );
    var alignmentManager = new Rectangle( 0, 0, minKeyWidth, minKeyHeight );

    // place the icon in the desired alignment
    keyIcon[ options.align ] = alignmentManager[ options.align ];
    alignmentManager.addChild( keyIcon );

    // handle offsets for fine tuning position
    keyIcon.x += options.xOffset;
    keyIcon.y += options.yOffset;

    // scale down the icon so that it fits entirely within the max width/height of the button
    var scaleWidth = options.maxKeyWidth / alignmentManager.width;
    var scaleHeight = options.maxKeyHeight / alignmentManager.height;
    var scaleFactor = Math.min( scaleWidth, scaleHeight, 1 );
    alignmentManager.setScaleMagnitude( scaleFactor );
    var keyPanel = new Panel( alignmentManager, {
      xMargin: 0,
      yMargin: 0,
      fill: options.keyFill,
      align: 'center',
      lineWidth: options.line,
      cornerRadius: options.cornerRadius
    } );

    var shadowRectangle = new Rectangle( keyPanel.bounds, {
      cornerRadius: options.cornerRadius,
      top: keyPanel.top + options.yShadowOffset,
      left: keyPanel.left + options.xShadowOffset,

      fill: options.keyShadowFill
    } );

    Node.call( this, options );
    this.addChild( shadowRectangle );
    this.addChild( keyPanel );

 }
 johnTravoltage.register( 'KeyNode', KeyNode );

  return inherit( Node, KeyNode );

} );
