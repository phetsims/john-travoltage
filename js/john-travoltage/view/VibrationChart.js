// Copyright 2019, University of Colorado Boulder

/**
 * A chart that visualizes vibration. Either "on" or "off", it produces a square wave to display vibration
 * over time.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const DynamicSeries = require( 'GRIDDLE/DynamicSeries' );
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ScrollingChartNode = require( 'GRIDDLE/ScrollingChartNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Panel = require( 'SUN/Panel' );

  // constants
  const MAX_TIME = 10; // seconds of plotted data

  class VibrationChart extends Node {

    /**
     * @param {BooleanProperty} vibratingProperty
     * @param {number} width
     * @param {number} height
     */
    constructor( vibratingProperty, width, height ) {
      super();

      // @private
      this.vibratingProperty = vibratingProperty;

      // @private {NumberProperty} - amount of time that has elapsed in order to plot vibration against time
      this.timeProperty = new NumberProperty( 0 );

      // create the plot
      this.vibrationSeries = new DynamicSeries( { color: 'orange' } );

      const verticalLabel = new Text( 'Vibration', {
        rotation: -Math.PI / 2
      } );
      const horizontalLabel = new Text( 'Time' );
      const scrollingChartNode = new ScrollingChartNode( this.timeProperty, [ this.vibrationSeries ], verticalLabel,
        horizontalLabel, new Text( '' ), {
          width: width,
          height: height,
          numberVerticalLines: MAX_TIME,
          numberHorizontalLines: 3
        } );

      // layout
      const labeledChartNode = new Node();
      labeledChartNode.addChild( scrollingChartNode );

      // contain in a panel
      const panel = new Panel( labeledChartNode, {
        fill: 'lightgrey'
      } );
      this.addChild( panel );
    }

    /**
     * Add data to the scrolling chart.
     *
     * @param {number} dt - in ms
     */
    step( dt ) {
      this.timeProperty.set( this.timeProperty.get() + dt );

      let vibrationDataPoint = -1;
      if ( this.vibratingProperty.get() ) {
        vibrationDataPoint = 1 + phet.joist.random.nextDouble() / 4 - 0.25;
      }
      this.vibrationSeries.addXYDataPoint( this.timeProperty.get(), vibrationDataPoint );

      while ( this.vibrationSeries.getDataPoint( 0 ).x < this.timeProperty.value - MAX_TIME ) {
        this.vibrationSeries.shiftData();
      }
    }
  }

  return johnTravoltage.register( 'VibrationChart', VibrationChart );
} );
