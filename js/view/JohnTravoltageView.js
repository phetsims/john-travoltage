// Copyright 2002-2013, University of Colorado Boulder


/**
 * Main ScreenView of simulation. Drawing starts here
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var ScreenView = require( 'JOIST/ScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BackgroundElementsNode = require( 'view/BackgroundElementsNode' );
  var ArmNode = require( 'view/ArmNode' );
  var LegNode = require( 'view/LegNode' );
  var SparkNode = require( 'view/SparkNode' );
  var MinusChargeNode = require( 'view/MinusChargeNode' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SoundToggleButton = require( 'SCENERY_PHET/SoundToggleButton' );

  function JohnTravoltageView( model ) {
    var self = this;

    ScreenView.call( this, {renderer: 'svg'} );

    //add background elements
    this.addChild( new BackgroundElementsNode() );

    //Split layers after background for performance
    this.addChild( new Node( {layerSplit: true, pickable: false} ) );

    //arm and leg - only interactive elements
    this.arm = new ArmNode( model.arm, self );
    this.addChild( this.arm );

    this.leg = new LegNode( model.leg, self );
    this.addChild( this.leg );

    //spark
    this.addChild( new SparkNode( model.spark, model.arm, model.box2dModel ) );

    //sound button
    this.addChild( new SoundToggleButton( model.soundProperty, {x: 700, y: 450} ) );

    var startPoint, currentPoint;
    this.rotationObject = null;

    //Split layers before particle layer for performance
    this.addChild( new Node( {layerSplit: true, pickable: false} ) );


    //listener to rotate arm or leg if needed
    this.addInputListener( {
        down: function( event ) {
          startPoint = self.globalToLocalPoint( event.pointer.point );
        },
        up: function( event ) {
          //release object
          self.rotationObject = null;
        },
        move: function( event ) {
          //if we click on arm or leg and move mouse - calculate rotation angle and set it
          if ( self.rotationObject ) {
            currentPoint = self.globalToLocalPoint( event.pointer.point );
            if ( currentPoint.x !== self.rotationObject.x && currentPoint.y !== self.rotationObject.y ) {
              var angle = Math.atan2( currentPoint.y - self.rotationObject.model.rotationCenter.y, currentPoint.x - self.rotationObject.model.rotationCenter.x );
              angle -= Math.atan2( startPoint.y - self.rotationObject.model.rotationCenter.y, startPoint.x - self.rotationObject.model.rotationCenter.x );
              self.rotationObject.model.rotationAngle += angle;
              self.rotationObject.rotateAround( self.rotationObject.model.rotationCenter, angle );
              startPoint = currentPoint;
            }
          }
        }
      }

    );

    //if new electron added to model - create and add new node to leg
    model.particles.addItemAddedListener( function( item ) {
      var newElectron = new MinusChargeNode( item );
      item.viewNode = newElectron;
      self.addChild( newElectron );
    } );

    //if last 3 position of leg is correct, add Electron to body
    model.leg.rotationAngleProperty.link( function legRotated( angle ) {
      var history = model.leg.angleHistory;
      var mustAddElectron = true;
      history.forEach( function( entry ) {
        if ( entry < 0.1 || entry > 0.8 ) {
          mustAddElectron = false;
        }
      } );
      if ( mustAddElectron ) {
        model.addElectron();
      }
    } );

    // debug lines, body and forceline, uncomment this to view physical bounds of body
//     borders are approximatly 8px = radius of particle from physical body, because physical raduis of electron = 1 in box2D
//     larger physical radius of electron causes many bugs and model become very slow
    var showBody = false;
    if ( showBody ) {
      //vertices and body path
      var verts = model.verts;
      var customShape = new Shape();
      customShape.moveTo( verts[0][0], verts[0][1] );

      //model have array of points - verticles of polygon - border of body
      for ( var i = 1; i < verts.length; i++ ) {
        customShape.lineTo( verts[i][0], verts[i][1] );
        customShape.moveTo( verts[i][0], verts[i][1] );
      }
      var path = new Path( customShape, {
        stroke: 'green',
        lineWidth: 1,
        pickable: false,
        x: 255,
        y: -135
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
  }

  return inherit( ScreenView, JohnTravoltageView );
} );