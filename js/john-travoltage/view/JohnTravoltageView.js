// Copyright 2013-2015, University of Colorado Boulder

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
  var AccessibleNode = require( 'SCENERY/accessibility/AccessibleNode' );
  var AccessibleDescriptionNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/AccessibleDescriptionNode' );
  var AppendageRangeMaps = require( 'JOHN_TRAVOLTAGE/john-travoltage/AppendageRangeMaps' );
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
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var JohnTravoltageQueryParameters = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageQueryParameters' );
  var JohnTravoltageAudio = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/JohnTravoltageAudio' );
  var JohnTravoltageModel = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/JohnTravoltageModel' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  // images
  var arm = require( 'image!JOHN_TRAVOLTAGE/arm.png' );
  var leg = require( 'image!JOHN_TRAVOLTAGE/leg.png' );

  // constants
  var SONIFICATION_CONTROL = JohnTravoltageQueryParameters.sonification;

  // strings
  var johnTravoltageTitleString = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.title' );

  /**
   * @param {JohnTravoltageModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function JohnTravoltageView( model, tandem, options ) {
    var self = this;
    this.model = model;
    options = _.extend( {
      //TODO: Once https://github.com/phetsims/john-travoltage/issues/98 has been addressed, update how the peerIDs
      //are added/referenced by the view.
      peerIDs: {
        alert: 'assertive-alert',
        status: 'polite-status'
      }
    }, options );

    // unhide the aria-live elements for use in this sim
    // TODO: should be handled in common code
    document.getElementById( 'aria-live-elements' ).hidden = false;

    //The sim works best in most browsers using svg.
    //But in firefox on Win8 it is very slow and buggy, so use canvas on firefox.
    ScreenView.call( this, {
      renderer: platform.firefox ? 'canvas' : null,
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      accessibleContent: null
    } );

    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        // the screen content should be contained in an article
        var domElement = document.createElement( 'article' );

        // create the label for the sim
        var labelElement = document.createElement( 'h1' );
        labelElement.textContent = johnTravoltageTitleString;
        domElement.appendChild( labelElement );

        var childContainerElement = document.createElement( 'div' );
        domElement.appendChild( childContainerElement );

        return new AccessiblePeer( accessibleInstance, domElement, {
          childContainerElement: childContainerElement
        } );
      }
    };

    //add background elements
    this.addChild( new BackgroundElementsNode() );

    //Split layers after background for performance
    this.addChild( new Node( { layerSplit: true, pickable: false } ) );

    //add an form element to contain all controls
    var accessibleFormNode = new AccessibleNode( {
      tagName: 'form'
    } );
    this.addChild( accessibleFormNode );

    // arm and leg - only interactive elements
    this.leg = new AppendageNode( model.leg, leg, 25, 28, Math.PI / 2 * 0.7, model.soundProperty, AppendageRangeMaps.leg, {
      controls: [ options.peerIDs.status ],
      labelTagName: 'label',
      label: JohnTravoltageA11yStrings.legSliderLabelString
    } );
    accessibleFormNode.addChild( this.leg );

    // the keyboardMidPointOffset was manually calculated as a radian offset that will trigger a discharge with the
    // minimum charge level.
    this.arm = new AppendageNode( model.arm, arm, 4, 45, -0.1, model.soundProperty, AppendageRangeMaps.arm, {
      keyboardMidPointOffset: 0.41,
      controls: [ options.peerIDs.status ],
      labelTagName: 'label',
      label: JohnTravoltageA11yStrings.armSliderLabelString
    } );
    accessibleFormNode.addChild( this.arm );

    //Show the dotted lines again when the sim is reset
    model.resetEmitter.addListener( function() {
      if ( !self.leg.dragging ) {
        self.leg.border.visible = true;
      }
      if ( !self.arm.dragging ) {
        self.arm.border.visible = true;
      }
    } );

    //spark
    accessibleFormNode.addChild( new SparkNode( model.sparkVisibleProperty, model.arm, model.doorknobPosition,
      function( listener ) {
        model.stepEmitter.addListener( listener );
      }, JohnTravoltageA11yStrings.electronsDischargedString, { peerID: options.peerIDs.alert } ) );

    //Sound button and reset all button
    var soundButton = new SoundToggleButton( model.soundProperty, {
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          // parent containing the dom element and its peer elements
          var parentContainerElement = document.createElement( 'div' );

          // the input element
          var domElement = document.createElement( 'input' );
          domElement.type = 'button';
          domElement.id = 'sound-button';
          domElement.setAttribute( 'aria-pressed', false );

          // button exists for life of sim, no need to dispose of listener
          domElement.addEventListener( 'click', function( event ) {
            model.soundProperty.set( !model.soundProperty.get() );
          } );

          // label for the input element
          var labelElement = document.createElement( 'label' );
          labelElement.setAttribute( 'for', domElement.id );
          labelElement.textContent = 'Mute Sound';

          parentContainerElement.appendChild( labelElement );

          return new AccessiblePeer( accessibleInstance, domElement, {
            parentContainerElement: parentContainerElement
          } );
        }
      }
    } );

    // when the sound property changes, toggle the 'aria-pressed' state
    // linked lazily as the parallel domElement won't exist in the document until
    // after instantiation
    model.soundProperty.lazyLink( function( pressed ) {
      document.getElementById( 'sound-button' ).setAttribute( 'aria-pressed', !pressed );
    } );  

    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      scale: 1.32
    } );
    resetAllButton.scale( soundButton.height / resetAllButton.height );
    accessibleFormNode.addChild( new HBox( {
      spacing: 10,
      children: [ soundButton, resetAllButton ],
      right: this.layoutBounds.maxX - 7,
      bottom: this.layoutBounds.maxY - 7
    } ) );

    //add sonification if enabled
    if ( SONIFICATION_CONTROL !== 'none' ) {
      this.audioView = new JohnTravoltageAudio( model, this.arm, SONIFICATION_CONTROL );
    }

    //Use a layer for electrons so it has only one pickable flag, perhaps may improve performance compared to iterating
    //over all electrons to see if they are pickable?
    //Split layers before particle layer for performance
    var electronLayer = new ElectronLayerNode( model.electrons, JohnTravoltageModel.MAX_ELECTRONS, model.leg, model.arm, {
      layerSplit: true,
      pickable: false,
      peerID: options.peerIDs.status
    } );
    accessibleFormNode.addChild( electronLayer );

    // Scene description
    var accessibleDescription = new AccessibleDescriptionNode( this.arm, this.leg, model.electrons, accessibleFormNode );
    this.addChild( accessibleDescription );

    // adjust the order of the accessible content so that the description comes before the form in the DOM order.
    this.setAccessibleOrder( [ accessibleDescription, accessibleFormNode ] );

    // the form is described by the description through aria-describedby
    accessibleFormNode.setAriaDescribedBy( accessibleDescription.id );

    // debug lines, body and forceline
    // borders are approximately 8px = radius of particle from physical body,
    // because physical radius of electron = 1 in box2D
    if ( JohnTravoltageQueryParameters.showDebugInfo ) {
      this.showBody();

      accessibleFormNode.addChild( new Circle( 10, {
        x: model.bodyVertices[ 0 ].x,
        y: model.bodyVertices[ 0 ].y,
        fill: 'blue'
      } ) );
      accessibleFormNode.addChild( new Circle( 10, { x: 0, y: 0, fill: 'blue' } ) );

      //Debugging for finger location
      var fingerCircle = new Circle( 10, { fill: 'red' } );
      model.arm.angleProperty.link( function() {
        fingerCircle.x = model.arm.getFingerPosition().x;
        fingerCircle.y = model.arm.getFingerPosition().y;
      } );
      accessibleFormNode.addChild( fingerCircle );

      new DebugPositions().debugLineSegments( this );
    }
  }

  johnTravoltage.register( 'JohnTravoltageView', JohnTravoltageView );

  return inherit( ScreenView, JohnTravoltageView, {

    // @public, step the view
    step: function( dt ) {

      // step the sonification
      this.audioView && this.audioView.step( dt );
    },

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
