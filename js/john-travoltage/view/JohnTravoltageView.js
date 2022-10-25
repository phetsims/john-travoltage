// Copyright 2013-2022, University of Colorado Boulder

/**
 * Main ScreenView of simulation. Drawing starts here
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 * @author John Blanco
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import { Shape } from '../../../../kite/js/imports.js';
import platform from '../../../../phet-core/js/platform.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import SceneryPhetStrings from '../../../../scenery-phet/js/SceneryPhetStrings.js';
import { Circle, Line, Node, Path, PDOMPeer } from '../../../../scenery/js/imports.js';
import PitchedPopGenerator from '../../../../tambo/js/sound-generators/PitchedPopGenerator.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundLevelEnum from '../../../../tambo/js/SoundLevelEnum.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import VibrationManageriOS from '../../../../tappi/js/VibrationManageriOS.js';

import chargesInBody_mp3 from '../../../sounds/chargesInBody_mp3.js';
import electricDischarge_mp3 from '../../../sounds/electricDischarge_mp3.js';
import gazouch_mp3 from '../../../sounds/gazouch_mp3.js';
import ouch_mp3 from '../../../sounds/ouch_mp3.js';
import johnTravoltage from '../../johnTravoltage.js';
import JohnTravoltageStrings from '../../JohnTravoltageStrings.js';
import AppendageRangeMaps from '../AppendageRangeMaps.js';
import JohnTravoltageQueryParameters from '../JohnTravoltageQueryParameters.js';
import JohnTravoltageModel from '../model/JohnTravoltageModel.js';
import AppendageNode from './AppendageNode.js';
import ArmNode from './ArmNode.js';
import ArmPositionSoundGenerator from './ArmPositionSoundGenerator.js';
import BackgroundNode from './BackgroundNode.js';
import DebugUtils from './DebugUtils.js';
import ElectronLayerNode from './ElectronLayerNode.js';
import FootDragSoundGenerator from './FootDragSoundGenerator.js';
import LegNode from './LegNode.js';
import SparkNode from './SparkNode.js';
import vibrationController from './vibrationController.js';

const screenSummaryBodyDescriptionPatternString = JohnTravoltageStrings.a11y.screenSummary.bodyDescriptionPattern;
const electronsSingleDescriptionString = JohnTravoltageStrings.a11y.electrons.singleDescription;
const electronsMultipleDescriptionPatternString = JohnTravoltageStrings.a11y.electrons.multipleDescriptionPattern;
const descriptionWithChargePatternString = JohnTravoltageStrings.a11y.screenSummary.descriptionWithChargePattern;
const voicingContentHintString = JohnTravoltageStrings.a11y.voicing.contentHint;
const voicingDetailedContentHintString = JohnTravoltageStrings.a11y.voicing.detailedContentHint;
const previousDischargePatternString = JohnTravoltageStrings.a11y.voicing.previousDischargePattern;
const screenSummaryWithPreviousDischargePatternString = JohnTravoltageStrings.a11y.voicing.screenSummaryWithPreviousDischargePattern;
const screenSummarySingleScreenIntroPatternStringProperty = SceneryPhetStrings.a11y.voicing.simSection.screenSummary.singleScreenIntroPatternStringProperty;
const overviewPatternString = JohnTravoltageStrings.a11y.voicing.overviewPattern;
const voicingChargedContentHintString = JohnTravoltageStrings.a11y.voicing.chargedContentHint;
const multipleElectronsOnBodyPatternString = JohnTravoltageStrings.a11y.voicing.multipleElectronsOnBodyPattern;

// constants
const OUCH_EXCLAMATION_DELAY = 0.5; // in seconds
const CHARGES_SOUND_GAIN_FACTOR = 0.1; // multiplier for charges-in-the-body sound, empirically determined

class JohnTravoltageView extends ScreenView {

  /**
   * @param {JohnTravoltageModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    const summaryNode = new Node( { tagName: 'p' } );

    super( {

      //The sim works best in most browsers using svg.
      //But in firefox on Win8 it is very slow and buggy, so use canvas on firefox.
      renderer: platform.firefox ? 'canvas' : null,
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      tandem: tandem,
      screenSummaryContent: summaryNode
    } );

    // @private
    this.model = model;

    // @private
    // Prototype emitters and listeners to assist in prototyping haptics - We need to know when a user is touching the
    // sim for https://github.com/phetsims/phet-io-wrapper-haptics/issues/5, but these are not instrumented for
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

    //add background elements
    this.addChild( new BackgroundNode( tandem.createTandem( 'backgroundNode' ) ) );

    //Split layers after background for performance
    this.addChild( new Node( { layerSplit: true, pickable: false } ) );

    // @public
    this.legNode = new LegNode( model.leg, model.electronGroup, tandem.createTandem( 'legNode' ) );
    this.addChild( this.legNode );

    // @public
    this.armNode = new ArmNode( model.arm, tandem.createTandem( 'armNode' ) );
    this.addChild( this.armNode );

    // @private (a11y) after travolta picks up electrons the first time, this flag will modify descriptions slightly
    this.includeElectronInfo = false;

    // Show the dotted lines again when the sim is reset
    model.resetEmitter.addListener( () => {
      if ( !model.leg.isDraggingProperty.get() ) {
        model.leg.borderVisibleProperty.set( true );
      }
      if ( !model.arm.isDraggingProperty.get() ) {
        model.arm.borderVisibleProperty.set( true );
      }

      this.includeElectronInfo = false;
      this.legNode.resetDescriptionCounters();
    } );

    // store the region when the discharge starts
    model.dischargeStartedEmitter.addListener( () => {
      const position = this.armNode.a11yAngleToPosition( model.arm.angleProperty.get() );
      const newRegion = AppendageNode.getRegion( position, AppendageRangeMaps.armMap.regions );
      this.legNode.resetDescriptionCounters();

      this.armNode.regionAtDischarge = newRegion;
      this.armNode.positionAtDischarge = this.armNode.inputValue;
    } );

    // spark
    const sparkNode = new SparkNode(
      model,
      listener => { model.stepEmitter.addListener( listener ); },
      tandem.createTandem( 'sparkNode' )
    );
    this.addChild( sparkNode );

    // reset all button
    const resetAllButton = new ResetAllButton( {
      radius: 23,
      right: this.layoutBounds.maxX - 8,
      bottom: this.layoutBounds.maxY - 8,
      listener: () => {
        model.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // pdom - the ResetAllButton is alone in a control panel in this sim
    this.addChild( resetAllButton );

    // @private - Use a layer for electrons so it has only one pickable flag, perhaps may improve performance compared
    // to iterating over all electrons to see if they are pickable? Split layers before particle layer for performance.
    this.electronLayer = new ElectronLayerNode( model, this.armNode, JohnTravoltageModel.MAX_ELECTRONS, tandem.createTandem( 'electronLayer' ), {
      layerSplit: true,
      pickable: false
    } );
    this.addChild( this.electronLayer );

    const updateDescription = () => {
      summaryNode.descriptionContent = this.createSceneDescription();
    };

    // electrons observable array exists for the lifetime of the sim, so there is no need to remove these listeners
    model.electronGroup.elementCreatedEmitter.addListener( () => {
      updateDescription();
      this.includeElectronInfo = true;
    } );

    model.electronGroup.elementDisposedEmitter.addListener( () => {
      if ( model.electronGroup.count === 0 ) {
        updateDescription();
      }
    } );

    // properties exist for life of sim, no need to unlink
    this.armNode.model.angleProperty.link( updateDescription );
    this.legNode.model.angleProperty.link( updateDescription );

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
      model.arm.angleProperty.link( () => {
        fingerCircle.x = model.arm.getFingerPosition().x;
        fingerCircle.y = model.arm.getFingerPosition().y;
      } );
      this.addChild( fingerCircle );

      // DebugUtils.debugLineSegments( this );
      DebugUtils.debugPositions( this );
    }

    // inverse of the resetInProgressProperty, used for muting sounds during reset
    const resetNotInProgressProperty = new DerivedProperty( [ model.resetInProgressProperty ], resetInProgress => !resetInProgress );

    // create and register the sound generators used in this view
    const ouchSoundClip = new SoundClip( ouch_mp3, { initialOutputLevel: 0.7 } );
    soundManager.addSoundGenerator( ouchSoundClip );
    const gazouchSoundClip = new SoundClip( gazouch_mp3, { initialOutputLevel: 0.8 } );
    soundManager.addSoundGenerator( gazouchSoundClip );
    const electricDischargeSoundClip = new SoundClip( electricDischarge_mp3, {
      loop: true,
      trimSilence: true,
      initialOutputLevel: 0.75
    } );
    soundManager.addSoundGenerator( electricDischargeSoundClip );
    const chargesInBodySoundClip = new SoundClip( chargesInBody_mp3, {
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
    soundManager.addSoundGenerator( popSoundGenerator, { sonificationLevel: SoundLevelEnum.EXTRA } );

    model.sparkVisibleProperty.link( sparkVisible => {

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

    // pdomOrder
    this.pdomPlayAreaNode.pdomOrder = [
      this.legNode,
      this.armNode,
      sparkNode,
      this.electronLayer
    ];
    this.pdomControlAreaNode.pdomOrder = [
      resetAllButton
    ];

    // code related to vibration prototype work - hidden behind a query param while we understand more about what
    // we want for this feature.
    const vibrationParam = phet.chipper.queryParameters.vibrationParadigm;
    if ( vibrationParam !== null ) {

      // sends messages to the containing Swift app
      const vibrationManager = new VibrationManageriOS();

      // controls simulation specific vibrations and uses vibrationManager to send messages
      vibrationController.initialize( model, this, vibrationManager );
    }
  }

  /**
   * step the view forward in time
   * @param {number} dt
   * @public
   */
  step( dt ) {
    this.footDragSoundGenerator.step( dt );
  }

  /**
   * Create the description of the simulation scene, describing John's hand and leg, and the number of charges
   * in his body.
   *
   * @private
   * @returns {string}
   */
  createSceneDescription() {
    let chargeDescription;
    let sceneDescription;

    // description for John - this will always be in the screen summary
    const positionDescription = AppendageNode.getPositionDescription( this.armNode.a11yAngleToPosition( this.model.arm.angleProperty.get() ), AppendageRangeMaps.armMap.regions );
    const johnDescription = StringUtils.fillIn( screenSummaryBodyDescriptionPatternString, { position: positionDescription } );

    // if there are any charges, a description of the charge will be prepended to the summary
    if ( this.includeElectronInfo ) {
      if ( this.model.electronGroup.count === 1 ) {
        chargeDescription = electronsSingleDescriptionString;
      }
      else {
        chargeDescription = StringUtils.fillIn( electronsMultipleDescriptionPatternString, {
          value: this.model.electronGroup.count
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

    return sceneDescription;
  }

  /**
   * Creates the voicing content for the "Overview" button from the Toolbar.
   * @public
   */
  getVoicingOverviewContent() {
    const overviewString = StringUtils.fillIn( screenSummarySingleScreenIntroPatternStringProperty, {
      sim: phet.joist.sim.simNameProperty.get()
    } );

    return StringUtils.fillIn( overviewPatternString, {
      overview: overviewString
    } );
  }

  /**
   * Similar to the PDOM scene description, but uses a qualitative description to describe the amount of
   * charge on the body.
   * @public
   * @override
   *
   * @returns {string}
   */
  getVoicingDetailsContent() {

    const model = this.model;

    const positionDescription = AppendageNode.getPositionDescription( this.armNode.a11yAngleToPosition( model.arm.angleProperty.get() ), AppendageRangeMaps.armMap.regions );
    const johnDescription = StringUtils.fillIn( screenSummaryBodyDescriptionPatternString, { position: positionDescription } );

    let screenDescription;
    if ( this.includeElectronInfo ) {
      const chargeDescription = StringUtils.fillIn( multipleElectronsOnBodyPatternString, {
        quantity: this.electronLayer.getQualitativeChargeDescription( model.electronGroup.count )
      } );

      screenDescription = StringUtils.fillIn( descriptionWithChargePatternString, {
        charge: chargeDescription,
        johnDescription: johnDescription
      } );
    }
    else {
      screenDescription = johnDescription;
    }

    // if there is a non-zero amount of electrons in the last discharge event describe this - this will be zero
    // until first discharge event and on reset
    if ( model.numberOfElectronsDischarged > 0 ) {
      const previousDischargeQuantity = this.electronLayer.getQualitativeChargeDescription( model.numberOfElectronsDischarged );
      const previousHandPosition = AppendageNode.getPositionDescription( this.armNode.positionAtDischarge, AppendageRangeMaps.armMap.regions );
      const previousDischargeDescription = StringUtils.fillIn( previousDischargePatternString, {
        quantity: previousDischargeQuantity,
        position: previousHandPosition
      } );

      screenDescription = StringUtils.fillIn( screenSummaryWithPreviousDischargePatternString, {
        screenSummary: screenDescription,
        previousDischarge: previousDischargeDescription
      } );
    }

    return screenDescription;
  }

  /**
   * Creates the content to be spoken by speech synthesis from the "Hint" button on the toolbar.
   * @public
   *
   * @returns {string}
   */
  getVoicingHintContent() {

    const chargeCount = this.model.electronGroup.count;
    let hintString = voicingContentHintString;

    if ( chargeCount > 0 && chargeCount < 10 ) {

      // a bit of charge, but maybe not enough to trigger a shock, guide user to more
      hintString = voicingDetailedContentHintString;
    }
    else if ( chargeCount >= 10 ) {

      // lots of charge, guide user toward discharging electrons
      hintString = voicingChargedContentHintString;
    }

    return hintString;
  }

  /**
   * Only used for debugging.  Show debug information for the body and charges, and visual information
   * regarding how the model calculates charge positions.
   * @private
   */
  showBody() {

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
}

johnTravoltage.register( 'JohnTravoltageView', JohnTravoltageView );
export default JohnTravoltageView;