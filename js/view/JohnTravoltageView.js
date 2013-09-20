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

  function JohnTravoltageView( model ) {
    var johnTravoltageView = this;

    ScreenView.call( this, {renderer: 'svg'} );

    //Sample model points for bounds, see JohnTravoltageModel.verts
    //TODO: Move this out to a separate file
    this.touchArea = Shape.rectangle( 0, 0, 1000, 1000 );
    this.mouseArea = Shape.rectangle( 0, 0, 1000, 1000 );
    var string = '';
    this.addInputListener( {
      down: function( event ) {
        var pt = event.pointer.point;
        var global = johnTravoltageView.globalToLocalPoint( pt );
        var a = 'new Vector2(' + global.x + ',' + global.y + '),\n';

        string = string + a;
        console.log( string );
      }
    } );

    //add background elements
    this.addChild( new BackgroundElementsNode() );

    //Split layers after background for performance
    this.addChild( new Node( {layerSplit: true, pickable: false} ) );

    //arm and leg - only interactive elements
    this.arm = new AppendageNode( model.arm, JohnTravoltageImages.getImage( 'arm.png' ), 4, 45, -0.1, johnTravoltageView );
    this.addChild( this.arm );

    this.leg = new AppendageNode( model.leg, JohnTravoltageImages.getImage( 'leg.png' ), 25, 28, Math.PI / 2 * 0.7, johnTravoltageView );
    this.addChild( this.leg );

    //spark
    this.addChild( new SparkNode( model.spark, model.arm, model.box2dModel ) );

    //sound button
    this.addChild( new SoundToggleButton( model.soundProperty, {x: 700, y: 450} ) );

    var startPoint, currentPoint;
    this.rotationObject = null;

    //Split layers before particle layer for performance
    //Use a layer for electrons so it has only one pickable flag, perhaps may improve performance compared to iterating over all electrons to see if they are pickable?
    var electronLayer = new Node( {layerSplit: true, pickable: false} );
    this.addChild( electronLayer );

    //if new electron added to model - create and add new node to leg
    //TODO: Pooling for creation and use visible instead of addChild for performance
    model.particles.addItemAddedListener( function( item ) {
      var newElectron = new ElectronNode( item, model, model.leg, johnTravoltageView.leg, johnTravoltageView );
      item.viewNode = newElectron;
      electronLayer.addChild( newElectron );
    } );

    // debug lines, body and forceline, uncomment this to view physical bounds of body
//     borders are approximatly 8px = radius of particle from physical body, because physical raduis of electron = 1 in box2D
//     larger physical radius of electron causes many bugs and model become very slow
    //TODO: move this to a separate file
    var showBody = false;
    if ( showBody ) {
      //vertices and body path
      var verts = model.verts;
      var customShape = new Shape();
      customShape.moveTo( verts[0].x, verts[0].y );

      //model have array of points - verticles of polygon - border of body
      for ( var i = 1; i < verts.length; i++ ) {
        customShape.lineTo( verts[i].x, verts[i].y );
      }
      var path = new Path( customShape, {
        stroke: 'green',
        lineWidth: 1,
        pickable: false
      } );
      this.addChild( path );

      //forcelines, which attract particles
      var lines = model.forceLines;
      for ( i = 0; i < lines.length; i++ ) {
        customShape = new Shape();
        customShape.moveTo( lines[i][0], lines[i][1] );
        customShape.lineTo( lines[i][2], lines[i][3] );
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

    this.addChild( new Circle( 10, {x: model.verts[0].x, y: model.verts[0].y, fill: 'blue'} ) );
    this.addChild( new Circle( 10, {x: 0, y: 0, fill: 'blue'} ) )
  }

  return inherit( ScreenView, JohnTravoltageView );
} );