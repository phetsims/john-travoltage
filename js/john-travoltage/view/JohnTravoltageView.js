// Copyright 2013-2020, University of Colorado Boulder

/**
 * Main ScreenView of simulation. Drawing starts here
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 * @author John Blanco
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import platform from '../../../../phet-core/js/platform.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PDOMPeer from '../../../../scenery/js/accessibility/pdom/PDOMPeer.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import PitchedPopGenerator from '../../../../tambo/js/sound-generators/PitchedPopGenerator.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundLevelEnum from '../../../../tambo/js/SoundLevelEnum.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import SaveTestEventsButton from '../../../../tappi/js/tracking/SaveTestEventsButton.js';
import VibrationTestEventRecorder from '../../../../tappi/js/tracking/VibrationTestEventRecorder.js';
import VibrationTestInputListener from '../../../../tappi/js/tracking/VibrationTestInputListener.js';
import VibrationManageriOS from '../../../../tappi/js/VibrationManageriOS.js';
import arm from '../../../images/arm_png.js';
import leg from '../../../images/leg_png.js';
import chargesInBodySound from '../../../sounds/charges-in-body_mp3.js';
import electricDischargeSound from '../../../sounds/electric-discharge_mp3.js';
import gazouchSound from '../../../sounds/gazouch_mp3.js';
import ouchSound from '../../../sounds/ouch_mp3.js';
import johnTravoltage from '../../johnTravoltage.js';
import johnTravoltageStrings from '../../johnTravoltageStrings.js';
import AppendageRangeMaps from '../AppendageRangeMaps.js';
import JohnTravoltageQueryParameters from '../JohnTravoltageQueryParameters.js';
import JohnTravoltageModel from '../model/JohnTravoltageModel.js';
import AppendageNode from './AppendageNode.js';
import ArmPositionSoundGenerator from './ArmPositionSoundGenerator.js';
import BackgroundNode from './BackgroundNode.js';
import BodyShapeHitDetector from './BodyShapeHitDetector.js';
import DebugUtils from './DebugUtils.js';
import ElectronLayerNode from './ElectronLayerNode.js';
import FootDragSoundGenerator from './FootDragSoundGenerator.js';
import SparkNode from './SparkNode.js';
import vibrationController from './vibrationController.js';
import VibrationTestEvent from '../../../../tappi/js/tracking/VibrationTestEvent.js';

const appendageLegLabelString = johnTravoltageStrings.a11y.appendages.leg.label;
const appendageArmLabelString = johnTravoltageStrings.a11y.appendages.arm.label;
const screenSummaryBodyDescriptionPatternString = johnTravoltageStrings.a11y.screenSummary.bodyDescriptionPattern;
const electronsSingleDescriptionString = johnTravoltageStrings.a11y.electrons.singleDescription;
const electronsMultipleDescriptionPatternString = johnTravoltageStrings.a11y.electrons.multipleDescriptionPattern;
const descriptionWithChargePatternString = johnTravoltageStrings.a11y.screenSummary.descriptionWithChargePattern;

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

  // @public (read-only) arm and leg - only interactive elements
  this.leg = new AppendageNode( model.leg, leg, 25, 28, Math.PI / 2 * 0.7, AppendageRangeMaps.legMap,
    tandem.createTandem( 'legNode' ), {
      labelContent: appendageLegLabelString
    } );
  this.addChild( this.leg );

  // @public (read-only) the keyboardMidPointOffset was manually calculated as a radian offset that will trigger a discharge with the
  // minimum charge level.
  this.arm = new AppendageNode( model.arm, arm, 4, 45, -0.1, AppendageRangeMaps.armMap,
    tandem.createTandem( 'armNode' ), {
      keyboardMidPointOffset: 0.41,
      labelContent: appendageArmLabelString
    } );
  this.addChild( this.arm );

  this.shapeHitDetector = new BodyShapeHitDetector( model, this );

  // code related to vibration prototype work - hidden behind a query param while we understand more about what
  // we want for this feature.
  if ( phet.chipper.queryParameters.vibration !== null ) {

    // @private {number} - time (in seconds) that the simulation has been running
    this.elapsedTime = 0;

    // sends messages to the containing Swift app
    const vibrationManager = new VibrationManageriOS();

    // controls simulation specific vibrations and uses vibrationManager to send messages
    vibrationController.initialize( model, this, vibrationManager );

    // listener that will detect pointer hits of various objects
    phet.joist.display.addInputListener( this.shapeHitDetector );

    // collection of input and simulation events that will be recorded during user interaction
    this.eventRecorder = new VibrationTestEventRecorder();

    // listener that watches finger/touch input and saves to the event recorder
    const vibrationTestInputListener = new VibrationTestInputListener( this.eventRecorder );
    phet.joist.display.addInputListener( vibrationTestInputListener );

    // button that will save data once user is finished
    const saveButton = new SaveTestEventsButton( vibrationManager, this.eventRecorder, {
      leftTop: this.layoutBounds.leftTop.plusXY( 5, 5 )
    } );
    this.addChild( saveButton );

    // sim specific events that we want to capture
    model.arm.angleProperty.lazyLink( angle => {
      this.eventRecorder.addTestEvent( new VibrationTestEvent( null, null, this.elapsedTime, 'Moving Arm' ) );
    } );
    model.leg.angleProperty.lazyLink( angle => {
      this.eventRecorder.addTestEvent( new VibrationTestEvent( null, null, this.elapsedTime, 'Moving Leg' ) );
    } );
    model.electronGroup.elementCreatedEmitter.addListener( () => {
      this.eventRecorder.addTestEvent( new VibrationTestEvent( null, null, this.elapsedTime, 'Added charge' ) );
    } );
    model.dischargeStartedEmitter.addListener( () => {
      this.eventRecorder.addTestEvent( new VibrationTestEvent( null, null, this.elapsedTime, 'Discharged electrons' ) );
    } );
    model.stepEmitter.addListener( dt => {
      this.elapsedTime += dt;
      vibrationTestInputListener.setElapsedTime( this.elapsedTime );
    } );

    // let user know that simulation is loaded, and let them know to begin reading through the PDOM
    phet.joist.sim.isConstructionCompleteProperty.link( complete => {
      if ( complete ) {
        phet.joist.sim.utteranceQueue.addToBack( 'Simulation loaded. Start reading to play.' );
      }
    } );
  }

  // (a11y) after travolta picks up electrons the first time, this flag will modify descriptions slightly
  let includeElectronInfo = false;

  // Show the dotted lines again when the sim is reset
  model.resetEmitter.addListener( function() {
    if ( !model.leg.isDraggingProperty.get() ) {
      model.leg.borderVisibleProperty.set( true );
    }
    if ( !model.arm.isDraggingProperty.get() ) {
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

  // pdom - the ResetAllButton is alone in a control panel in this sim
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
    const johnDescription = StringUtils.fillIn( screenSummaryBodyDescriptionPatternString, { position: positionDescription } );

    // if there are any charges, a description of the charge will be prepended to the summary
    if ( includeElectronInfo ) {
      if ( model.electronGroup.count === 1 ) {
        chargeDescription = electronsSingleDescriptionString;
      }
      else {
        chargeDescription = StringUtils.fillIn( electronsMultipleDescriptionPatternString, {
          value: model.electronGroup.count
        } );
      }

      sceneDescription = StringUtils.fillIn( descriptionWithChargePatternString, {
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
  model.electronGroup.elementCreatedEmitter.addListener( () => {
    updateDescription();
    includeElectronInfo = true;
  } );

  model.electronGroup.elementDisposedEmitter.addListener( () => {
    if ( model.electronGroup.count === 0 ) {
      updateDescription();
    }
  } );

  // properties exist for life of sim, no need to unlink
  this.arm.model.angleProperty.link( updateDescription );
  this.leg.model.angleProperty.link( updateDescription );

  // the play area is described by the screen view's description sibling through aria-describedby
  this.pdomPlayAreaNode.addAriaDescribedbyAssociation( {
    thisElementName: PDOMPeer.PRIMARY_SIBLING,
    otherNode: this,
    otherElementName: PDOMPeer.DESCRIPTION_SIBLING
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

    //Debugging for finger position
    const fingerCircle = new Circle( 10, { fill: 'red' } );
    model.arm.angleProperty.link( function() {
      fingerCircle.x = model.arm.getFingerPosition().x;
      fingerCircle.y = model.arm.getFingerPosition().y;
    } );
    this.addChild( fingerCircle );

    // DebugUtils.debugLineSegments( this );
    DebugUtils.debugPositions( this );
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
      const numElectronsInBody = model.electronGroup.count;
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
  const lengthChangedListener = () => {
    const numElectrons = model.electronGroup.count;
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
  };

  model.electronGroup.elementCreatedEmitter.addListener( lengthChangedListener );
  model.electronGroup.elementDisposedEmitter.addListener( lengthChangedListener );

  // TODO: This can be removed now that we are transitioning to #337
  this.vibratingProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'vibratingProperty' )
  } );

  // accessibleOrder
  this.pdomPlayAreaNode.accessibleOrder = [
    this.leg,
    this.arm,
    sparkNode,
    electronLayer
  ];
  this.pdomControlAreaNode.accessibleOrder = [
    resetAllButton
  ];
}

johnTravoltage.register( 'JohnTravoltageView', JohnTravoltageView );

inherit( ScreenView, JohnTravoltageView, {

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
    const hitPaths = this.shapeHitDetector.getDebugPaths();
    hitPaths.forEach( path => { this.addChild( path ); } );

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

    let path = new Path( this.model.bodyShape, {
      stroke: 'orange',
      lineWidth: 2,
      pickable: false
    } );
    this.addChild( path );

    // forcelines, which attract particles
    const lines = this.model.forceLines;
    let customShape;
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

export default JohnTravoltageView;