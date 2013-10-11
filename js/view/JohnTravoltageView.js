// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main ScreenView of simulation. Drawing starts here
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var ScreenView = require( 'JOIST/ScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BackgroundElementsNode = require( 'JOHN_TRAVOLTAGE/view/BackgroundElementsNode' );
  var AppendageNode = require( 'JOHN_TRAVOLTAGE/view/AppendageNode' );
  var SparkNode = require( 'JOHN_TRAVOLTAGE/view/SparkNode' );
  var ElectronNode = require( 'JOHN_TRAVOLTAGE/view/ElectronNode' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SoundToggleButton = require( 'SCENERY_PHET/SoundToggleButton' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var DebugPositions = require( 'JOHN_TRAVOLTAGE/view/DebugPositions' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var platform = require( 'PHET_CORE/platform' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var arm = require( 'image!JOHN_TRAVOLTAGE/arm.png' );
  var leg = require( 'image!JOHN_TRAVOLTAGE/leg.png' );

  function JohnTravoltageView( model ) {
    var johnTravoltageView = this;
    this.model = model;

    //The sim works best in most browsers using svg. But in firefox on Win8 it is very slow and buggy, so use canvas on firefox.
    ScreenView.call( this, {renderer: platform.firefox ? 'canvas' : 'svg'} );

    //add background elements
    this.addChild( new BackgroundElementsNode() );

    //Split layers after background for performance
    this.addChild( new Node( {layerSplit: true, pickable: false} ) );

    //arm and leg - only interactive elements
    this.leg = new AppendageNode( model.leg, leg, 25, 28, Math.PI / 2 * 0.7 );
    this.addChild( this.leg );

    this.arm = new AppendageNode( model.arm, arm, 4, 45, -0.1 );
    this.addChild( this.arm );

    //Show the dotted lines again when the sim is reset
    model.on( 'reset', function() {
      if ( !johnTravoltageView.leg.dragging ) {
        johnTravoltageView.leg.border.visible = true;
      }
      if ( !johnTravoltageView.arm.dragging ) {
        johnTravoltageView.arm.border.visible = true;
      }
    } );

    //spark
    this.addChild( new SparkNode( model.sparkVisibleProperty, model.arm, model.doorknobPosition, function( listener ) {
      model.on( 'step', listener );
    } ) );

    //Sound button and reset all button
    var soundButton = new SoundToggleButton( model.soundProperty );
    var resetAllButton = new ResetAllButton( model.reset.bind( model ) );
    resetAllButton.scale( soundButton.height / resetAllButton.height );
    this.addChild( new HBox( {spacing: 10, children: [soundButton, resetAllButton], right: this.layoutBounds.maxX - 7, bottom: this.layoutBounds.maxY - 7} ) );

    //Split layers before particle layer for performance
    //Use a layer for electrons so it has only one pickable flag, perhaps may improve performance compared to iterating over all electrons to see if they are pickable?
    var electronLayer = new Node( {layerSplit: true, pickable: false} );
    this.addChild( electronLayer );

    //if new electron added to model - create and add new node to leg
    //TODO: Pooling for creation and use visible instead of addChild for performance
    model.electrons.addItemAddedListener( function( added ) {
      var newElectron = new ElectronNode( added, model.leg, model.arm );
      added.viewNode = newElectron;
      electronLayer.addChild( newElectron );

      var itemRemovedListener = function( removed ) {
        if ( removed === added ) {
          electronLayer.removeChild( newElectron );
          model.electrons.removeItemRemovedListener( itemRemovedListener );
        }
      };
      model.electrons.addItemRemovedListener( itemRemovedListener );
    } );

    // debug lines, body and forceline, uncomment this to view physical bounds of body
    // borders are approximately 8px = radius of particle from physical body, because physical radius of electron = 1 in box2D
    var showDebugInfo = false;
    if ( showDebugInfo ) {
      this.showBody();

      this.addChild( new Circle( 10, {x: model.bodyVertices[0].x, y: model.bodyVertices[0].y, fill: 'blue'} ) );
      this.addChild( new Circle( 10, {x: 0, y: 0, fill: 'blue'} ) );

      //Debugging for finger location
      var fingerCircle = new Circle( 10, {fill: 'red'} );
      model.arm.angleProperty.link( function( angle ) {
        fingerCircle.x = model.arm.getFingerPosition().x;
        fingerCircle.y = model.arm.getFingerPosition().y;
      } );
      this.addChild( fingerCircle );
    }
  }

  return inherit( ScreenView, JohnTravoltageView, {
    showBody: function() {
      //vertices and body path
      var bodyVertices = this.model.bodyVertices;
      var customShape = new Shape();
      customShape.moveTo( bodyVertices[0].x, bodyVertices[0].y );

      //model have array of points - vertices of polygon - border of body
      for ( var i = 1; i < bodyVertices.length; i++ ) {
        customShape.lineTo( bodyVertices[i].x, bodyVertices[i].y );
      }
      var path = new Path( customShape, {
        stroke: 'green',
        lineWidth: 1,
        pickable: false
      } );
      this.addChild( path );

      //forcelines, which attract particles
      var lines = this.model.forceLines;
      for ( i = 0; i < lines.length; i++ ) {
        customShape = new Shape();
        customShape.moveTo( lines[i].x1, lines[i].y1 );
        customShape.lineTo( lines[i].x2, lines[i].y2 );
        path = new Path( customShape, {
          stroke: 'red',
          lineWidth: 1,
          pickable: false,
          x: 0,
          y: 0
        } );
        this.addChild( path );
      }
    }
  } );
} );