// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main ScreenView of simulation. Drawing starts here
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var AppendageNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/AppendageNode' );
  var AppendageRangeMaps = require( 'JOHN_TRAVOLTAGE/john-travoltage/AppendageRangeMaps' );
  var ArmPositionSoundGenerator = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ArmPositionSoundGenerator' );
  var BackgroundNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/BackgroundNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ControlAreaNode = require( 'SCENERY_PHET/accessibility/nodes/ControlAreaNode' );
  var DebugUtils = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/DebugUtils' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var ElectronLayerNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ElectronLayerNode' );
  var FootDragSoundGenerator = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/FootDragSoundGenerator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var JohnTravoltageModel = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/JohnTravoltageModel' );
  var JohnTravoltageQueryParameters = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageQueryParameters' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PitchedPopGenerator = require( 'TAMBO/sound-generators/PitchedPopGenerator' );
  var platform = require( 'PHET_CORE/platform' );
  var PlayAreaNode = require( 'SCENERY_PHET/accessibility/nodes/PlayAreaNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ResetAllSoundGenerator = require( 'TAMBO/sound-generators/ResetAllSoundGenerator' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shape = require( 'KITE/Shape' );
  var SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  var SoundLevelEnum = require( 'TAMBO/SoundLevelEnum' );
  var soundManager = require( 'TAMBO/soundManager' );
  var SparkNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/SparkNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // sounds
  var chargesInBodySound = require( 'sound!JOHN_TRAVOLTAGE/charges-in-body.mp3' );
  var electricDischargeSound = require( 'sound!JOHN_TRAVOLTAGE/electric-discharge.mp3' );
  var gazouchSound = require( 'sound!JOHN_TRAVOLTAGE/gazouch.mp3' );
  var ouchSound = require( 'sound!JOHN_TRAVOLTAGE/ouch.mp3' );

  // images
  var arm = require( 'image!JOHN_TRAVOLTAGE/arm.png' );
  var leg = require( 'image!JOHN_TRAVOLTAGE/leg.png' );

  // a11y strings
  var legSliderLabelString = JohnTravoltageA11yStrings.legSliderLabel.value;
  var armSliderLabelString = JohnTravoltageA11yStrings.armSliderLabel.value;
  var screenSummaryJohnPatternString = JohnTravoltageA11yStrings.screenSummaryJohnPattern.value;
  var electronsDescriptionSingleString = JohnTravoltageA11yStrings.electronsDescriptionSingle.value;
  var electronsDescriptionMultipleString = JohnTravoltageA11yStrings.electronsDescriptionMultiple.value;
  var screenSummaryWithChargePatternString = JohnTravoltageA11yStrings.screenSummaryWithChargePattern.value;

  // constants
  var OUCH_EXCLAMATION_DELAY = 0.5; // in seconds
  var CHARGES_SOUND_GAIN_FACTOR = 0.1; // multiplier for charges-in-the-body sound, empirically determined

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

    // everything except the ResetAllButton is contained in this node
    var playAreaNode = new PlayAreaNode();
    this.addChild( playAreaNode );

    // @public (read-only) arm and leg - only interactive elements
    this.leg = new AppendageNode( model.leg, leg, 25, 28, Math.PI / 2 * 0.7, AppendageRangeMaps.legMap,
      tandem.createTandem( 'legNode' ), {
        labelContent: legSliderLabelString
      } );
    playAreaNode.addChild( this.leg );

    // @public (read-only) the keyboardMidPointOffset was manually calculated as a radian offset that will trigger a discharge with the
    // minimum charge level.
    this.arm = new AppendageNode( model.arm, arm, 4, 45, -0.1, AppendageRangeMaps.armMap,
      tandem.createTandem( 'armNode' ), {
        keyboardMidPointOffset: 0.41,
        labelContent: armSliderLabelString
      } );
    playAreaNode.addChild( this.arm );

    // (a11y) after travolta picks up electrons the first time, this flag will modify descriptions slightly
    var includeElectronInfo = false;

    // Show the dotted lines again when the sim is reset
    model.resetEmitter.addListener( function() {
      if ( !self.leg.dragging ) {
        model.leg.borderVisibleProperty.set( true );
      }
      if ( !self.arm.dragging ) {
        model.arm.borderVisibleProperty.set( true );
      }
      
      includeElectronInfo = false;
    } );

    // store the region when the discharge starts
    model.dischargeStartedEmitter.addListener( function() {
      var position = self.arm.a11yAngleToPosition( model.arm.angleProperty.get() );
      var newRegion = AppendageNode.getRegion( position, AppendageRangeMaps.armMap.regions );

      self.arm.regionAtDischarge = newRegion;
      self.arm.positionAtDischarge = self.arm.inputValue;
    } );

    // spark
    playAreaNode.addChild( new SparkNode(
      model,
      function( listener ) { model.stepEmitter.addListener( listener ); },
      tandem.createTandem( 'sparkNode' )
    ) );

    // reset all button
    var resetAllButton = new ResetAllButton( {
      radius: 23,
      right: this.layoutBounds.maxX - 8,
      bottom: this.layoutBounds.maxY - 8,
      listener: function() {
        model.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    soundManager.addSoundGenerator( new ResetAllSoundGenerator( model.resetInProgressProperty, {
      initialOutputLevel: 0.7
    } ) );

    // a11y - the ResetAllButton is alone in a control panel in this sim
    var controlAreaNode = new ControlAreaNode();
    controlAreaNode.addChild( resetAllButton );
    this.addChild( controlAreaNode );

    // Use a layer for electrons so it has only one pickable flag, perhaps may improve performance compared to iterating
    // over all electrons to see if they are pickable?
    // Split layers before particle layer for performance
    var electronLayer = new ElectronLayerNode( model, this.arm, JohnTravoltageModel.MAX_ELECTRONS, tandem.createTandem( 'electronLayer' ), {
      layerSplit: true,
      pickable: false
    } );
    playAreaNode.addChild( electronLayer );

    var updateDescription = function() {
      var chargeDescription;
      var sceneDescription;

      // description for John - this will always be in the screen summary
      var positionDescription = AppendageNode.getPositionDescription( self.arm.a11yAngleToPosition( model.arm.angleProperty.get() ), AppendageRangeMaps.armMap.regions );
      var johnDescription = StringUtils.fillIn( screenSummaryJohnPatternString, { position: positionDescription } );

      // if there are any charges, a description of the charge will be prepended to the summary
      if ( includeElectronInfo ) {
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

    // electrons observable array exists for the lifetime of the sim, so there is no need to remove these listeners
    model.electrons.addItemAddedListener( function() {
      updateDescription();
      includeElectronInfo = true;
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

    // inverse of the resetInProgressProperty, used for muting sounds during reset
    var resetNotInProgressProperty = new DerivedProperty( [ model.resetInProgressProperty ], function( resetInProgress ) {
      return !resetInProgress;
    } );

    // create and register the sound generators used in this view
    var ouchSoundClip = new SoundClip( ouchSound, { initialOutputLevel: 0.7 } );
    soundManager.addSoundGenerator( ouchSoundClip );
    var gazouchSoundClip = new SoundClip( gazouchSound, { initialOutputLevel: 0.8 } );
    soundManager.addSoundGenerator( gazouchSoundClip );
    var electricDischargeSoundClip = new SoundClip( electricDischargeSound, {
      loop: true,
      trimSilence: true,
      initialOutputLevel: 0.75
    } );
    soundManager.addSoundGenerator( electricDischargeSoundClip );
    var chargesInBodySoundClip = new SoundClip( chargesInBodySound, {
      loop: true,
      trimSilence: true,
      initialOutputLevel: 0.1
    } );
    soundManager.addSoundGenerator( chargesInBodySoundClip );
    soundManager.addSoundGenerator( new ArmPositionSoundGenerator( model.arm.angleProperty, {
      enableControlProperties: [ resetNotInProgressProperty ],
      initialOutputLevel: 0.2
    } ) );
    this.footDragSoundGenerator = new FootDragSoundGenerator(
      model.leg.angleProperty,
      JohnTravoltageModel.FOOT_ON_CARPET_MIN_ANGLE,
      JohnTravoltageModel.FOOT_ON_CARPET_MAX_ANGLE,
      {
        enableControlProperties: [ resetNotInProgressProperty ],
        initialOutputLevel: 0.35
      }
    );
    soundManager.addSoundGenerator( this.footDragSoundGenerator );
    var popSoundGenerator = new PitchedPopGenerator( {
      enableControlProperties: [ resetNotInProgressProperty ],
      initialOutputLevel: 0.3
    } );
    soundManager.addSoundGenerator( popSoundGenerator, { sonificationLevel: SoundLevelEnum.ENHANCED } );

    model.sparkVisibleProperty.link( function( sparkVisible ) {

      if ( sparkVisible ) {

        // start the electric discharge sound
        electricDischargeSoundClip.play();

        // play the appropriate "ouch" sound based on the level of charge (plays nothing for low charge level)
        var numElectronsInBody = model.electrons.length;
        if ( numElectronsInBody > 85 ) {
          gazouchSoundClip.play( OUCH_EXCLAMATION_DELAY );
        }
        else if ( numElectronsInBody > 30 ) {
          ouchSoundClip.play( OUCH_EXCLAMATION_DELAY );
        }
      }
      else {

        // stop the electric discharge sound (if playing)
        electricDischargeSoundClip.stop();
      }
    } );

    // update the sound related to the number of electrons in JT's body
    model.electrons.lengthProperty.lazyLink( function( numElectrons ) {

      // update the sound that indicates the amount of charge in the body
      if ( numElectrons === 0 ) {
        if ( chargesInBodySoundClip.isPlaying ) {
          chargesInBodySoundClip.stop();
        }
      }
      else {

        // set the gain based on the number of electrons, this equation was empirically determined
        chargesInBodySoundClip.setOutputLevel(
          0.01 + 0.99 * ( numElectrons / JohnTravoltageModel.MAX_ELECTRONS ) * CHARGES_SOUND_GAIN_FACTOR
        );

        // set the playback speed based on the number of electrons, equation empirically determined
        chargesInBodySoundClip.setPlaybackRate( 1 + 0.25 * ( numElectrons / JohnTravoltageModel.MAX_ELECTRONS ) );

        // start loop if necessary
        if ( !chargesInBodySoundClip.isPlaying ) {
          chargesInBodySoundClip.play();
        }
      }

      // play a pop each time the number of electrons changes
      popSoundGenerator.playPop( numElectrons / JohnTravoltageModel.MAX_ELECTRONS );
    } );
  }

  johnTravoltage.register( 'JohnTravoltageView', JohnTravoltageView );

  return inherit( ScreenView, JohnTravoltageView, {

    /**
     * step the view forward in time
     * @param {number} dt
     * @public
     */
    step: function( dt ) {
      this.footDragSoundGenerator.step( dt );
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
