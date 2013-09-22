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
  var ArmNode = require( 'JOHN_TRAVOLTAGE/view/ArmNode' );
  var AppendageNode = require( 'JOHN_TRAVOLTAGE/view/AppendageNode' );
  var SparkNode = require( 'JOHN_TRAVOLTAGE/view/SparkNode' );
  var ElectronNode = require( 'JOHN_TRAVOLTAGE/view/ElectronNode' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SoundToggleButton = require( 'SCENERY_PHET/SoundToggleButton' );
  var JohnTravoltageImages = require( 'JOHN_TRAVOLTAGE/JohnTravoltageImages' );
  var DebugPositions = require( 'JOHN_TRAVOLTAGE/view/DebugPositions' );

  function JohnTravoltageView( model ) {
    var johnTravoltageView = this;
    this.model = model;

    ScreenView.call( this, {renderer: 'svg'} );

    //Sample model points for bounds, vertices or pivots, see JohnTravoltageModel.bodyVertices
//    new DebugPositions().debugPositions( this );

    //Sample and print line segments, for creating force paths for electrons during spark traversal
//    new DebugPositions().debugLineSegments( this );

    //add background elements
    this.addChild( new BackgroundElementsNode() );

    //Split layers after background for performance
    this.addChild( new Node( {layerSplit: true, pickable: false} ) );

    //arm and leg - only interactive elements
    this.leg = new AppendageNode( model.leg, JohnTravoltageImages.getImage( 'leg.png' ), 25, 28, Math.PI / 2 * 0.7, johnTravoltageView );
    this.addChild( this.leg );

    this.arm = new AppendageNode( model.arm, JohnTravoltageImages.getImage( 'arm.png' ), 4, 45, -0.1, johnTravoltageView );
    this.addChild( this.arm );

    //spark
    this.addChild( new SparkNode( model ) );

    //sound button
    this.addChild( new SoundToggleButton( model.soundProperty, {x: 700, y: 450} ) );

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
    //  borders are approximatly 8px = radius of particle from physical body, because physical raduis of electron = 1 in box2D
//    this.showBody();

//    this.addChild( new Circle( 10, {x: model.bodyVertices[0].x, y: model.bodyVertices[0].y, fill: 'blue'} ) );
//    this.addChild( new Circle( 10, {x: 0, y: 0, fill: 'blue'} ) );

    //Debugging for finger location
//    var fingerCircle = new Circle( 10, {fill: 'red'} );
//    model.arm.angleProperty.link( function( angle ) {
//      fingerCircle.x = model.arm.getFingerPosition().x;
//      fingerCircle.y = model.arm.getFingerPosition().y;
//    } );
//    this.addChild( fingerCircle );
  }

  return inherit( ScreenView, JohnTravoltageView, {
    showBody: function() {
      //vertices and body path
      var bodyVertices = this.model.bodyVertices;
      var customShape = new Shape();
      customShape.moveTo( bodyVertices[0].x, bodyVertices[0].y );

      //model have array of points - verticles of polygon - border of body
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