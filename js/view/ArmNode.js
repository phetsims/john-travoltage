// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the arm of the model.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var JohnTravoltageImages = require( 'JOHN_TRAVOLTAGE/JohnTravoltageImages' );
  var armImage = require( 'image!JOHN_TRAVOLTAGE/../images/arm.png' );

  function ArmNode( model, scene ) {
    var self = this;

    Node.call( this, { cursor: 'pointer' } );

    this.x = model.position.x;
    this.y = model.position.y;

    this.model = model;

    this.addInputListener( {
      down: function( event ) {
        self.border.visible = false;
      }
    } );

    // add the Balloon image
    this.addChild( new Image( armImage ) );

    this.border = new Path( new Shape.roundRect( 0, 0, 120, 70, 10, 10 ), {
      x: 0, y: 0,
      stroke: '#f58220',
      lineWidth: 1,
      lineDash: [ 10, 10 ]
    } );
    this.addChild( this.border );

    //changes visual position
    model.angleProperty.link( function updatePosition( angle ) {
      self.rotation = angle;
    } );
  }

  return inherit( Node, ArmNode );
} );