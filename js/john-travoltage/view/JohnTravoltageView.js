// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main ScreenView of simulation. Drawing starts here
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  const AppendageNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/AppendageNode' );
  const AppendageRangeMaps = require( 'JOHN_TRAVOLTAGE/john-travoltage/AppendageRangeMaps' );
  const ArmPositionSoundGenerator = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ArmPositionSoundGenerator' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const BackgroundNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/BackgroundNode' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DebugUtils = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/DebugUtils' );
  const ShapeHitDetector = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ShapeHitDetector' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Emitter = require( 'AXON/Emitter' );
  const ElectronLayerNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ElectronLayerNode' );
  const FootDragSoundGenerator = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/FootDragSoundGenerator' );
  const inherit = require( 'PHET_CORE/inherit' );
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  const JohnTravoltageModel = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/JohnTravoltageModel' );
  const JohnTravoltageQueryParameters = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageQueryParameters' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PitchedPopGenerator = require( 'TAMBO/sound-generators/PitchedPopGenerator' );
  const platform = require( 'PHET_CORE/platform' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ResetAllSoundGenerator = require( 'TAMBO/sound-generators/ResetAllSoundGenerator' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Shape = require( 'KITE/Shape' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const SoundLevelEnum = require( 'TAMBO/SoundLevelEnum' );
  const soundManager = require( 'TAMBO/soundManager' );
  const SparkNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/SparkNode' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const vibrationManager = require( 'TAPPI/vibrationManager' );
  const VibrationChart = require( 'TAPPI/view/VibrationChart' );
  const vibrationController = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/vibrationController' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // sounds
  const chargesInBodySound = require( 'sound!JOHN_TRAVOLTAGE/charges-in-body.mp3' );
  const electricDischargeSound = require( 'sound!JOHN_TRAVOLTAGE/electric-discharge.mp3' );
  const gazouchSound = require( 'sound!JOHN_TRAVOLTAGE/gazouch.mp3' );
  const ouchSound = require( 'sound!JOHN_TRAVOLTAGE/ouch.mp3' );

  // images
  const arm = require( 'image!JOHN_TRAVOLTAGE/arm.png' );
  const leg = require( 'image!JOHN_TRAVOLTAGE/leg.png' );

  // a11y strings
  const legSliderLabelString = JohnTravoltageA11yStrings.legSliderLabel.value;
  const armSliderLabelString = JohnTravoltageA11yStrings.armSliderLabel.value;
  const screenSummaryJohnPatternString = JohnTravoltageA11yStrings.screenSummaryJohnPattern.value;
  const electronsDescriptionSingleString = JohnTravoltageA11yStrings.electronsDescriptionSingle.value;
  const electronsDescriptionMultipleString = JohnTravoltageA11yStrings.electronsDescriptionMultiple.value;
  const screenSummaryWithChargePatternString = JohnTravoltageA11yStrings.screenSummaryWithChargePattern.value;

  // constants
  const OUCH_EXCLAMATION_DELAY = 0.5; // in seconds
  const CHARGES_SOUND_GAIN_FACTOR = 0.1; // multiplier for charges-in-the-body sound, empirically determined

  /**
   * @param {JohnTravoltageModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function JohnTravoltageView( model, tandem ) {
    const self = this;
    this.model = model;

    // Prototype emitters and listeners to assist in prototyping haptics - We need to know when a user is touching the
    // sim for https://github.com/phetsims/phet-io-wrapper-haptics/issues/5, but these are not instremented for
    // PhET-iO in scenery. These can be removed once they are instrumented and once prototyping is complete
    // in john-travoltage.
    this.touchStartEmitter = new Emitter( {
      tandem: tandem.createTandem( 'touchStartEmitter' )
    } );
    this.touchEndEmitter = new Emitter( {
      tandem: tandem.createTandem( 'touchEndEmitter' )
    } );

    this.touchMoveEmitter = new Emitter( {
      tandem: tandem.createTandem( 'touchMoveEmitter' )
    } );

    window.addEventListener( 'touchstart', () => {
      this.touchStartEmitter.emit();
    } );
    window.addEventListener( 'touchend', () => {
      this.touchEndEmitter.emit();
    } );
    window.addEventListener( 'touchmove', () => {
      this.touchMoveEmitter.emit();
    } );

    const summaryNode = new Node( { tagName: 'p' } );

    //The sim works best in most browsers using svg.
    //But in firefox on Win8 it is very slow and buggy, so use canvas on firefox.
    ScreenView.call( this, {
      renderer: platform.firefox ? 'canvas' : null,
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      tandem: tandem,
      screenSummaryContent: summaryNode
    } );

    //add background elements
    this.addChild( new BackgroundNode( tandem.createTandem( 'backgroundNode' ) ) );

    //Split layers after background for performance
    this.addChild( new Node( { layerSplit: true, pickable: false } ) );

    this.shapeHitDetector = new ShapeHitDetector( tandem.createTandem( 'shapeHitDetector' ) );
    this.shapeHitDetector.addShape( model.bodyShape, model.touchingBodyProperty );
    this.shapeHitDetector.addShape( model.carpetShape, model.touchingCarpetProperty );
    this.addChild( this.shapeHitDetector );

    // @public (read-only) arm and leg - only interactive elements
    this.leg = new AppendageNode( model.leg, leg, 25, 28, Math.PI / 2 * 0.7, AppendageRangeMaps.legMap,
      tandem.createTandem( 'legNode' ), {
        labelContent: legSliderLabelString
      } );
    this.addChild( this.leg );

    // @public (read-only) the keyboardMidPointOffset was manually calculated as a radian offset that will trigger a discharge with the
    // minimum charge level.
    this.arm = new AppendageNode( model.arm, arm, 4, 45, -0.1, AppendageRangeMaps.armMap,
      tandem.createTandem( 'armNode' ), {
        keyboardMidPointOffset: 0.41,
        labelContent: armSliderLabelString
      } );
    this.addChild( this.arm );

    // (a11y) after travolta picks up electrons the first time, this flag will modify descriptions slightly
    let includeElectronInfo = false;

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
      const position = self.arm.a11yAngleToPosition( model.arm.angleProperty.get() );
      const newRegion = AppendageNode.getRegion( position, AppendageRangeMaps.armMap.regions );

      self.arm.regionAtDischarge = newRegion;
      self.arm.positionAtDischarge = self.arm.inputValue;
    } );

    // spark
    const sparkNode = new SparkNode(
      model,
      function( listener ) { model.stepEmitter.addListener( listener ); },
      tandem.createTandem( 'sparkNode' )
    );
    this.addChild( sparkNode );

    // reset all button
    const resetAllButton = new ResetAllButton( {
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
    this.addChild( resetAllButton );

    // Use a layer for electrons so it has only one pickable flag, perhaps may improve performance compared to iterating
    // over all electrons to see if they are pickable?
    // Split layers before particle layer for performance
    const electronLayer = new ElectronLayerNode( model, this.arm, JohnTravoltageModel.MAX_ELECTRONS, tandem.createTandem( 'electronLayer' ), {
      layerSplit: true,
      pickable: false
    } );
    this.addChild( electronLayer );

    const updateDescription = function() {
      let chargeDescription;
      let sceneDescription;

      // description for John - this will always be in the screen summary
      const positionDescription = AppendageNode.getPositionDescription( self.arm.a11yAngleToPosition( model.arm.angleProperty.get() ), AppendageRangeMaps.armMap.regions );
      const johnDescription = StringUtils.fillIn( screenSummaryJohnPatternString, { position: positionDescription } );

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
    this.playAreaNode.addAriaDescribedbyAssociation( {
      thisElementName: AccessiblePeer.PRIMARY_SIBLING,
      otherNode: this,
      otherElementName: AccessiblePeer.DESCRIPTION_SIBLING
    } );

    // debug lines, body and forceline
    // borders are approximately 8px = radius of particle from physical body,
    // because physical radius of electron = 1 in box2D
    if ( JohnTravoltageQueryParameters.showDebugInfo ) {
      this.showBody();

      this.addChild( new Circle( 10, {
        x: model.bodyVertices[ 0 ].x,
        y: model.bodyVertices[ 0 ].y,
        fill: 'blue'
      } ) );
      this.addChild( new Circle( 10, { x: 0, y: 0, fill: 'blue' } ) );

      //Debugging for finger location
      const fingerCircle = new Circle( 10, { fill: 'red' } );
      model.arm.angleProperty.link( function() {
        fingerCircle.x = model.arm.getFingerPosition().x;
        fingerCircle.y = model.arm.getFingerPosition().y;
      } );
      this.addChild( fingerCircle );

      DebugUtils.debugLineSegments( this );
    }

    // inverse of the resetInProgressProperty, used for muting sounds during reset
    const resetNotInProgressProperty = new DerivedProperty( [ model.resetInProgressProperty ], function( resetInProgress ) {
      return !resetInProgress;
    } );

    // create and register the sound generators used in this view
    const ouchSoundClip = new SoundClip( ouchSound, { initialOutputLevel: 0.7 } );
    soundManager.addSoundGenerator( ouchSoundClip );
    const gazouchSoundClip = new SoundClip( gazouchSound, { initialOutputLevel: 0.8 } );
    soundManager.addSoundGenerator( gazouchSoundClip );
    const electricDischargeSoundClip = new SoundClip( electricDischargeSound, {
      loop: true,
      trimSilence: true,
      initialOutputLevel: 0.75
    } );
    soundManager.addSoundGenerator( electricDischargeSoundClip );
    const chargesInBodySoundClip = new SoundClip( chargesInBodySound, {
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
    const popSoundGenerator = new PitchedPopGenerator( {
      enableControlProperties: [ resetNotInProgressProperty ],
      initialOutputLevel: 0.3
    } );
    soundManager.addSoundGenerator( popSoundGenerator, { sonificationLevel: SoundLevelEnum.ENHANCED } );

    model.sparkVisibleProperty.link( function( sparkVisible ) {

      if ( sparkVisible ) {

        // start the electric discharge sound
        electricDischargeSoundClip.play();

        // play the appropriate "ouch" sound based on the level of charge (plays nothing for low charge level)
        const numElectronsInBody = model.electrons.length;
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

    // TODO: This can be removed now that we are transitioning to #337
    this.vibratingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'vibratingProperty' )
    } );

    // implements all vibration feedback for this sim
    vibrationController.initialize( model );

    if ( JohnTravoltageQueryParameters.vibrationChart ) {
      this.vibrationChart = new VibrationChart( vibrationManager.vibratingProperty, this.layoutBounds.width * 0.75, 75, {
        labelFont: new PhetFont( 14 )
      } );

      this.addChild( this.vibrationChart );
      this.vibrationChart.centerTop = this.layoutBounds.centerTop;
    }

    // accessibleOrder
    this.playAreaNode.accessibleOrder = [
      this.leg,
      this.arm,
      sparkNode,
      electronLayer
    ];
    this.controlAreaNode.accessibleOrder = [
      resetAllButton
    ];
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

      if ( this.vibrationIndicator ) {
        this.vibrationIndicator.step( dt );
      }
      if ( this.vibrationChart ) {
        this.vibrationChart.step( dt );
      }
    },

    /**
     * Only used for debugging.  Show debug information for the body and charges, and visual information
     * regarding how the model calculates charge positions.
     * @private
     */
    showBody: function() {
      //vertices and body path
      // var customShape = new Shape();
      // var lineSegment = null;
      // for ( var i = 0; i < this.model.lineSegments.length; i++ ) {
      //   lineSegment = this.model.lineSegments[ i ];
      //   customShape.moveTo( lineSegment.x1, lineSegment.y1 );
      //   customShape.lineTo( lineSegment.x2, lineSegment.y2 );
      // }
      this.shapeHitDetector.showShapes();

      //Show normals
      let lineSegment;
      for ( let i = 0; i < this.model.lineSegments.length; i++ ) {
        lineSegment = this.model.lineSegments[ i ];
        const center = lineSegment.center;
        const normal = lineSegment.normal.times( 50 );
        this.addChild( new Line( center.x, center.y, center.x + normal.x, center.y + normal.y, {
          lineWidth: 2,
          stroke: 'blue'
        } ) );
      }

      // var path = new Path( this.model.bodyShape, {
      //   stroke: 'green',
      //   lineWidth: 1,
      //   pickable: false
      // } );
      // this.addChild( path );

      // forcelines, which attract particles
      const lines = this.model.forceLines;
      let customShape;
      let path;
      for ( let i = 0; i < lines.length; i++ ) {
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
