// Copyright 2013-2015, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Main ScreenView of simulation. Drawing starts here
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Line = require( 'SCENERY/nodes/Line' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BackgroundElementsNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/BackgroundElementsNode' );
  var LabelNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/LabelNode' );
  var AppendageNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/AppendageNode' );
  var SparkNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/SparkNode' );
  var ElectronLayerNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ElectronLayerNode' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var DebugPositions = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/DebugPositions' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var platform = require( 'PHET_CORE/platform' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  // images
  var arm = require( 'image!JOHN_TRAVOLTAGE/arm.png' );
  var leg = require( 'image!JOHN_TRAVOLTAGE/leg.png' );

  // strings
  var armLabelText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.armSliderLabel' );
  var legLabelText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.legSliderLabel' );
  var footOnCarpetText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.foot.onCarpet' );
  var footOffCarpetText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.foot.offCarpet' );
  var handClosestText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.hand.closest' );
  var handVeryCloseText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.hand.veryClose' );
  var handCloseText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.hand.close' );
  var handNeitherText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.hand.neither' );
  var handFarText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.hand.far' );
  var handVeryFarText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.hand.veryFar' );
  var handFarthestText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.hand.farthest' );
  var dischargeText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.electrons.discharged' );


  // rangeMaps
  var legRangeMap = [
    {
        range: {
            max: 5,
            min: 0
        },
        text: footOffCarpetText
    }, {
        range: {
            max: 21,
            min: 6
        },
        text: footOnCarpetText
    }, {
        range: {
            max: 30,
            min: 22
        },
        text: footOffCarpetText
    }
  ];


  var armRangeMap = [
    {
        range: {
            max: 0,
            min: 0
        },
        text: handFarthestText
    }, {
        range: {
            max: 12,
            min: 1
        },
        text: handVeryFarText
    }, {
        range: {
            max: 24,
            min: 13
        },
        text: handFarText
    }, {
        range: {
            max: 25,
            min: 25
        },
        text: handNeitherText
    }, {
        range: {
            max: 37,
            min: 26
        },
        text: handCloseText
    }, {
        range: {
            max: 49,
            min: 38
        },
        text: handVeryCloseText
    }, {
        range: {
            max: 50,
            min: 50
        },
        text: handClosestText
    }, {
        range: {
            max: 62,
            min: 51
        },
        text: handVeryCloseText
    }, {
        range: {
            max: 74,
            min: 63
        },
        text: handCloseText
    }, {
        range: {
            max: 75,
            min: 75
        },
        text: handNeitherText
    }, {
        range: {
            max: 87,
            min: 76
        },
        text: handFarText
    }, {
        range: {
            max: 99,
            min: 88
        },
        text: handVeryFarText
    }, {
        range: {
            max: 100,
            min: 100
        },
        text: handFarthestText
    }
  ];


  function JohnTravoltageView( model ) {
    var johnTravoltageView = this;
    this.model = model;

    //The sim works best in most browsers using svg. But in firefox on Win8 it is very slow and buggy, so use canvas on firefox.
    ScreenView.call( this, {
      renderer: platform.firefox ? 'canvas' : null,
      layoutBounds: new Bounds2( 0, 0, 768, 504 )
    } );

    //add background elements
    this.addChild( new BackgroundElementsNode() );

    //Split layers after background for performance
    this.addChild( new Node( { layerSplit: true, pickable: false } ) );

    //arm and leg - only interactive elements
    var legLabel = new LabelNode( legLabelText );
    this.addChild(legLabel);
    this.leg = new AppendageNode( model.leg, leg, 25, 28, Math.PI / 2 * 0.7, legRangeMap);
    legLabel.addChild( this.leg );

    var armLabel = new LabelNode( armLabelText );
    this.addChild(armLabel);
    // the keyboardMidPointOffset was manually calculated as a radian offset that will trigger a discharge with the
    // minimum charge level.
    this.arm = new AppendageNode( model.arm, arm, 4, 45, -0.1 , armRangeMap, { keyboardMidPointOffset: 0.41 } );
    armLabel.addChild( this.arm );

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
    }, dischargeText ) );

    //Sound button and reset all button
    var soundButton = new SoundToggleButton( model.soundProperty );
    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      scale: 1.32
    } );
    resetAllButton.scale( soundButton.height / resetAllButton.height );
    this.addChild( new HBox( {
      spacing: 10,
      children: [ soundButton, resetAllButton ],
      right: this.layoutBounds.maxX - 7,
      bottom: this.layoutBounds.maxY - 7
    } ) );

    //Split layers before particle layer for performance
    //Use a layer for electrons so it has only one pickable flag, perhaps may improve performance compared to iterating over all electrons to see if they are pickable?
    var electronLayer = new ElectronLayerNode( model.electrons, model.leg, model.arm, { layerSplit: true, pickable: false } );
    this.addChild( electronLayer );

    // Add container for accessible content
    this.setAccessibleContent( {
      createPeer: function( accessibleInstance ) {
        var domElement = document.createElement( 'form' );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    } );

    // debug lines, body and forceline, uncomment this to view physical bounds of body
    // borders are approximately 8px = radius of particle from physical body, because physical radius of electron = 1 in box2D
    var showDebugInfo = false;
    if ( showDebugInfo ) {
      this.showBody();

      this.addChild( new Circle( 10, { x: model.bodyVertices[ 0 ].x, y: model.bodyVertices[ 0 ].y, fill: 'blue' } ) );
      this.addChild( new Circle( 10, { x: 0, y: 0, fill: 'blue' } ) );

      //Debugging for finger location
      var fingerCircle = new Circle( 10, { fill: 'red' } );
      model.arm.angleProperty.link( function() {
        fingerCircle.x = model.arm.getFingerPosition().x;
        fingerCircle.y = model.arm.getFingerPosition().y;
      } );
      this.addChild( fingerCircle );

      new DebugPositions().debugLineSegments( this );
    }
  }

  johnTravoltage.register( 'JohnTravoltageView', JohnTravoltageView );

  return inherit( ScreenView, JohnTravoltageView, {
    showBody: function() {
      //vertices and body path
      var customShape = new Shape();
      var lineSegment = null;
      for ( var i = 0; i < this.model.lineSegments.length; i++ ) {
        lineSegment = this.model.lineSegments[ i ];
        customShape.moveTo( lineSegment.x1, lineSegment.y1 );
        customShape.lineTo( lineSegment.x2, lineSegment.y2 );
      }

      //Show normals
      for ( i = 0; i < this.model.lineSegments.length; i++ ) {
        lineSegment = this.model.lineSegments[ i ];
        var center = lineSegment.center;
        var normal = lineSegment.normal.times( 50 );
        this.addChild( new Line( center.x, center.y, center.x + normal.x, center.y + normal.y, {
          lineWidth: 2,
          stroke: 'blue'
        } ) );
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
        customShape.moveTo( lines[ i ].x1, lines[ i ].y1 );
        customShape.lineTo( lines[ i ].x2, lines[ i ].y2 );
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
