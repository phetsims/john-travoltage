define( function( require ) {
  "use strict";
  var TabView = require( 'JOIST/TabView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BackgroundElementsNode = require( "view/BackgroundElementsNode" );
  var ArmNode = require( 'view/ArmNode' );
  var LegNode = require( 'view/LegNode' );
  var SparkNode = require( 'view/SparkNode' );
  var MinusChargeNode = require( 'view/MinusChargeNode' );

  function JohnTravoltagePlayArea( model ) {
    var self = this;

    TabView.call( this );

    this.addChild( new BackgroundElementsNode() );

    this.arm = new ArmNode( model.arm, self );
    this.addChild( this.arm );

    this.leg = new LegNode( model.leg, self );
    this.addChild( this.leg );

    this.addChild( new SparkNode(model.spark) );

    var startPoint, currentPoint;
    this.rotationObject = null;

    this.addInputListener( {
        down: function( event ) {
          startPoint = self.globalToLocalPoint( event.pointer.point );
        },
        up: function( event ) {
          self.rotationObject = null;
        },
        move: function( event ) {
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

    var particlesNodes = [];
    model.link( 'particles', function updateLocation( particles) {
      particlesNodes.forEach(function detachOldParticle (entry){
        entry.detach();
      });

      particles.forEach(function attachNewParticle (entry){
        var newNode = new MinusChargeNode(entry);
        self.addChild(newNode);
        particlesNodes.push(newNode);
      });

    } );

  }

  inherit( TabView, JohnTravoltagePlayArea );
  return JohnTravoltagePlayArea;
} )
;
