// Copyright 2013-2017, University of Colorado Boulder

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
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var AppendageNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/AppendageNode' );
  var AppendageRangeMaps = require( 'JOHN_TRAVOLTAGE/john-travoltage/AppendageRangeMaps' );
  var BackgroundNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/BackgroundNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var DebugUtils = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/DebugUtils' );
  var ElectronLayerNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ElectronLayerNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var JohnTravoltageAudio = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/audio/JohnTravoltageAudio' );
  var JohnTravoltageModel = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/JohnTravoltageModel' );
  var JohnTravoltageQueryParameters = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageQueryParameters' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var platform = require( 'PHET_CORE/platform' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shape = require( 'KITE/Shape' );
  var Sound = require( 'VIBE/Sound' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var SparkNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/SparkNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // audio
  var shockAudio = require( 'audio!JOHN_TRAVOLTAGE/shock.mp3' );
  var shockOuchAudio = require( 'audio!JOHN_TRAVOLTAGE/shock-ouch.mp3' );

  // images
  var arm = require( 'image!JOHN_TRAVOLTAGE/arm.png' );
  var leg = require( 'image!JOHN_TRAVOLTAGE/leg.png' );

  // constants
  var SONIFICATION_CONTROL = JohnTravoltageQueryParameters.sonification;

  // a11y strings
  var playAreaString = JohnTravoltageA11yStrings.playAreaString.value;
  var controlPanelString = JohnTravoltageA11yStrings.controlPanelString.value;
  var legSliderLabelString = JohnTravoltageA11yStrings.legSliderLabelString.value;
  var armSliderLabelString = JohnTravoltageA11yStrings.armSliderLabelString.value;
  var screenSummaryJohnPatternString = JohnTravoltageA11yStrings.screenSummaryJohnPatternString.value;
  var electronsDescriptionSingleString = JohnTravoltageA11yStrings.electronsDescriptionSingleString.value;
  var electronsDescriptionMultipleString = JohnTravoltageA11yStrings.electronsDescriptionMultipleString.value;
  var screenSummaryWithChargePatternString = JohnTravoltageA11yStrings.screenSummaryWithChargePatternString.value;

  /**
   * @param {JohnTravoltageModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function JohnTravoltageView( model, tandem ) {
    var self = this;
    this.model = model;

    //The sim works best in most browsers using svg.
    //But in firefox on Win8 it is very slow and buggy, so use canvas on firefox.
    ScreenView.call( this, {
      renderer: platform.firefox ? 'canvas' : null,
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      tandem: tandem,

      // a11y - temporary option, should be fully removed once https://github.com/phetsims/scenery-phet/issues/393 is
      // complete
      addScreenSummaryNode: true
    } );

    //add background elements
    this.addChild( new BackgroundNode( tandem.createTandem( 'backgroundNode' ) ) );

    //Split layers after background for performance
    this.addChild( new Node( { layerSplit: true, pickable: false } ) );

    var summaryNode = new Node( { tagName: 'p' } );
    this.screenSummaryNode.addChild( summaryNode );

    //add an form element to contain all controls
    // the container parent is given role "none" so screen readers don't read contents of the play area when focus moves
    // out of the navigation bar - JAWS is very confusing in its summary of this content
    var playAreaNode = new Node( {
      containerTagName: 'section',
      containerAriaRole: 'none',
      tagName: 'div',
      labelTagName: 'h2',
      labelContent: playAreaString
    } );
    this.addChild( playAreaNode );

    var controlPanelNode = new Node( {
      containerTagName: 'section',
      tagName: 'div',
      ariaRole: 'none',
      labelTagName: 'h2',
      labelContent: controlPanelString
    } );
    this.addChild( controlPanelNode );

    // @public (read-only) arm and leg - only interactive elements
    this.leg = new AppendageNode( model.leg, leg, 25, 28, Math.PI / 2 * 0.7, model.soundEnabledProperty, AppendageRangeMaps.legMap,
      tandem.createTandem( 'legNode' ), {
        labelContent: legSliderLabelString
      } );
    playAreaNode.addChild( this.leg );

    // @public (read-only) the keyboardMidPointOffset was manually calculated as a radian offset that will trigger a discharge with the
    // minimum charge level.
    this.arm = new AppendageNode( model.arm, arm, 4, 45, -0.1, model.soundEnabledProperty, AppendageRangeMaps.armMap,
      tandem.createTandem( 'armNode' ), {
        keyboardMidPointOffset: 0.41,
        labelContent: armSliderLabelString
      } );
    playAreaNode.addChild( this.arm );

    // Show the dotted lines again when the sim is reset
    model.resetEmitter.addListener( function() {
      if ( !self.leg.dragging ) {
        model.leg.borderVisibleProperty.set( true );
      }
      if ( !self.arm.dragging ) {
        model.arm.borderVisibleProperty.set( true );
      }
    } );

    // store the region when the discharge starts
    model.dischargeStartedEmitter.addListener( function() {
      self.arm.regionAtDischarge = self.arm.currentRegion;
      self.arm.positionAtDischarge = self.arm.inputValue;
    } );

    // spark
    playAreaNode.addChild( new SparkNode(
      model,
      function( listener ) { model.stepEmitter.addListener( listener ); },
      tandem.createTandem( 'sparkNode' )
    ) );

    // Sound button and reset all button
    var soundToggleButton = new SoundToggleButton( model.soundEnabledProperty, {
      tandem: tandem.createTandem( 'soundToggleButton' )
    } );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();

        // clear alert content
        utteranceQueue.clear();
      },
      scale: 1.32,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    resetAllButton.scale( soundToggleButton.height / resetAllButton.height );
    controlPanelNode.addChild( new HBox( {
      spacing: 10,
      children: [ soundToggleButton, resetAllButton ],
      right: this.layoutBounds.maxX - 7,
      bottom: this.layoutBounds.maxY - 7
    } ) );

    // add sonification if enabled
    if ( SONIFICATION_CONTROL !== 'none' ) {
      this.audioView = new JohnTravoltageAudio( model, this.arm, resetAllButton, SONIFICATION_CONTROL );
    }

    // Use a layer for electrons so it has only one pickable flag, perhaps may improve performance compared to iterating
    // over all electrons to see if they are pickable?
    // Split layers before particle layer for performance
    var electronLayer = new ElectronLayerNode( model, this.arm, JohnTravoltageModel.MAX_ELECTRONS, tandem.createTandem( 'electronLayer' ), {
      layerSplit: true,
      pickable: false
    } );
    playAreaNode.addChild( electronLayer );

    // after travolta picks up electrons the first time, this flag will modify descriptions slightly
    var hadElectrons = false;
    var updateDescription = function() {
      var chargeDescription;
      var sceneDescription;

      // description for John - this will always be in the screen summary
      var positionDescription = self.arm.positionDescription;
      var johnDescription = StringUtils.fillIn( screenSummaryJohnPatternString, { position: positionDescription } );

      // if there are any charges, a description of the charge will be prepended to the summary
      if ( hadElectrons ) {
        if ( model.electrons.length === 1 ) {
          chargeDescription = electronsDescriptionSingleString;
        }
        else {
          chargeDescription = StringUtils.fillIn( electronsDescriptionMultipleString, {
            value: model.electrons.length
          } );
        }

        sceneDescription = StringUtils.fillIn( screenSummaryWithChargePatternString, {
          charge: chargeDescription,
          johnDescription: johnDescription
        } );
      }
      else {
        sceneDescription = johnDescription;
      }

      summaryNode.descriptionContent = sceneDescription;
    };

    // electrons observable array exists for the lifetime of the sim, so there is no need to remove these
    // listeners
    model.electrons.addItemAddedListener( function() {
      updateDescription();
      hadElectrons = true;
    } );

    model.electrons.addItemRemovedListener( function() {
      if ( model.electrons.length === 0 ) {
        updateDescription();
      }
    } );

    // properties exist for life of sim, no need to unlink
    this.arm.model.angleProperty.link( updateDescription );
    this.leg.model.angleProperty.link( updateDescription );

    // the play area is described by the screen view's description sibling through aria-describedby
    playAreaNode.addAriaDescribedbyAssociation( {
      thisElementName: AccessiblePeer.PRIMARY_SIBLING,
      otherNode: this,
      otherElementName: AccessiblePeer.DESCRIPTION_SIBLING
    } );

    // debug lines, body and forceline
    // borders are approximately 8px = radius of particle from physical body,
    // because physical radius of electron = 1 in box2D
    if ( JohnTravoltageQueryParameters.showDebugInfo ) {
      this.showBody();

      playAreaNode.addChild( new Circle( 10, {
        x: model.bodyVertices[ 0 ].x,
        y: model.bodyVertices[ 0 ].y,
        fill: 'blue'
      } ) );
      playAreaNode.addChild( new Circle( 10, { x: 0, y: 0, fill: 'blue' } ) );

      //Debugging for finger location
      var fingerCircle = new Circle( 10, { fill: 'red' } );
      model.arm.angleProperty.link( function() {
        fingerCircle.x = model.arm.getFingerPosition().x;
        fingerCircle.y = model.arm.getFingerPosition().y;
      } );
      playAreaNode.addChild( fingerCircle );

      DebugUtils.debugLineSegments( this );
    }

    if ( JohnTravoltageQueryParameters.valueText ) {
      var armText = new Text( this.arm.valueTextProperty.get(), { x: 15, y: 20, font: new PhetFont( 16 ) } );
      var legText = new Text( this.leg.valueTextProperty.get(), { x: 15, y: 40, font: new PhetFont( 16 ) } );
      this.addChild( armText );
      this.addChild( legText );

      this.arm.valueTextProperty.link( function( text ) { armText.text = text; } );
      this.leg.valueTextProperty.link( function( text ) { legText.text = text; } );
    }

    this.sounds = [
      new Sound( shockOuchAudio ),
      new Sound( shockAudio )
    ];

    model.sparkVisibleProperty.link( function( sparkVisible ) {
      if ( sparkVisible && model.soundEnabledProperty.get() ) {
        self.sounds[ Math.floor( phet.joist.random.nextDouble() * 2 ) ].play();
      }
    } );
  }

  johnTravoltage.register( 'JohnTravoltageView', JohnTravoltageView );

  return inherit( ScreenView, JohnTravoltageView, {

    /**
     * Step function for the view.
     * @param  {number} dt - seconds
     * @public
     */
    step: function( dt ) {

      // step the sonification
      this.audioView && this.audioView.step( dt );
    },

    /**
     * Only used for debugging.  Show debug information for the body and charges, and visual information
     * regarding how the model calculates charge positions.
     * @private
     */
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

      // forcelines, which attract particles
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
