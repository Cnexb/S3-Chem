/* HKDSE Rates of Reaction Lab — Custom Canvas Graphing Utility */
var Graphs = (function () {

  // Base Chart Class
  function BaseChart(canvas, xLabel, yLabel, xMin, xMax, yMin, yMax, themeColor) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.xLabel = xLabel;
    this.yLabel = yLabel;
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this.themeColor = themeColor || '#4f46e5';
    
    // Padding and margins
    this.padding = { top: 20, right: 20, bottom: 40, left: 65 };
  }

  BaseChart.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  BaseChart.prototype.drawAxes = function () {
    var ctx = this.ctx;
    var w = this.canvas.width;
    var h = this.canvas.height;
    var p = this.padding;

    ctx.save();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;

    // Draw X and Y axis lines
    ctx.beginPath();
    ctx.moveTo(p.left, p.top);
    ctx.lineTo(p.left, h - p.bottom);
    ctx.lineTo(w - p.right, h - p.bottom);
    ctx.stroke();

    // Draw soft grid lines and Y-axis ticks
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    var yTicks = 5;
    for (var i = 0; i <= yTicks; i++) {
      var yVal = this.yMin + (this.yMax - this.yMin) * (i / yTicks);
      var yPos = h - p.bottom - (h - p.top - p.bottom) * (i / yTicks);
      
      // Grid line
      if (i > 0) {
        ctx.beginPath();
        ctx.moveTo(p.left, yPos);
        ctx.lineTo(w - p.right, yPos);
        ctx.stroke();
      }

      // Tick label
      ctx.fillText(yVal.toFixed(yVal < 0.1 ? 3 : 1), p.left - 8, yPos);
    }

    // Draw X-axis ticks
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    var xTicks = 5;
    for (var j = 0; j <= xTicks; j++) {
      var xVal = this.xMin + (this.xMax - this.xMin) * (j / xTicks);
      var xPos = p.left + (w - p.left - p.right) * (j / xTicks);

      // Grid line
      if (j > 0) {
        ctx.beginPath();
        ctx.moveTo(xPos, p.top);
        ctx.lineTo(xPos, h - p.bottom);
        ctx.stroke();
      }

      // Tick label
      ctx.fillText(xVal.toFixed(xVal < 0.1 ? 2 : 0), xPos, h - p.bottom + 6);
    }

    // Draw Axis Labels
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 10px sans-serif';
    
    // X Label
    ctx.fillText(this.xLabel, p.left + (w - p.left - p.right) / 2, h - 15);

    // Y Label (rotated)
    ctx.save();
    ctx.translate(15, p.top + (h - p.top - p.bottom) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(this.yLabel, 0, 0);
    ctx.restore();

    ctx.restore();
  };

  BaseChart.prototype.toScreenCoords = function (x, y) {
    var w = this.canvas.width;
    var h = this.canvas.height;
    var p = this.padding;

    var sx = p.left + (w - p.left - p.right) * ((x - this.xMin) / (this.xMax - this.xMin));
    var sy = h - p.bottom - (h - p.top - p.bottom) * ((y - this.yMin) / (this.yMax - this.yMin));
    return { x: sx, y: sy };
  };


  // 1. Real-time Transmission Chart
  function TransmissionChart(canvas, xLabel, yLabel) {
    BaseChart.call(this, canvas, xLabel, yLabel, 0, 60, 0, 100, '#4f46e5');
    this.data = []; // Array of {t, trans}
  }
  TransmissionChart.prototype = Object.create(BaseChart.prototype);
  TransmissionChart.prototype.constructor = TransmissionChart;

  TransmissionChart.prototype.updateData = function (newData) {
    this.data = newData;
    
    // Dynamically scale X-axis limit if time exceeds 60s
    if (this.data.length > 0) {
      var maxTime = this.data[this.data.length - 1].t;
      if (maxTime > this.xMax) {
        this.xMax = Math.ceil(maxTime / 30) * 30; // increase in 30s steps
      }
    } else {
      this.xMax = 60;
    }

    this.draw();
  };

  TransmissionChart.prototype.draw = function () {
    this.clear();
    this.drawAxes();

    if (this.data.length < 2) return;

    var ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = this.themeColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    var start = this.toScreenCoords(this.data[0].t, this.data[0].trans);
    ctx.moveTo(start.x, start.y);

    for (var i = 1; i < this.data.length; i++) {
      var pt = this.toScreenCoords(this.data[i].t, this.data[i].trans);
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // Draw a horizontal dashed line at 1.0% representing the "blot out" threshold
    var blotY = this.toScreenCoords(0, 1.0).y;
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.moveTo(this.padding.left, blotY);
    ctx.lineTo(this.canvas.width - this.padding.right, blotY);
    ctx.stroke();

    ctx.restore();
  };


  // 2. Rate vs. Temperature Chart
  function RateTempChart(canvas, xLabel, yLabel) {
    BaseChart.call(this, canvas, xLabel, yLabel, 0, 70, 0, 0.10, '#f59e0b');
    this.points = []; // Array of {temp, rate}
    this.theoreticalEngine = null; // Reference to KineticsEngine to draw theoretical curve
  }
  RateTempChart.prototype = Object.create(BaseChart.prototype);
  RateTempChart.prototype.constructor = RateTempChart;

  RateTempChart.prototype.updatePoints = function (points, engine) {
    this.points = points;
    this.theoreticalEngine = engine;

    // Dynamically scale Y-axis limit if rates are high
    if (this.points.length > 0) {
      var maxRate = Math.max.apply(Math, this.points.map(function (p) { return p.rate; }));
      if (maxRate > this.yMax) {
        this.yMax = Math.ceil(maxRate * 100) / 100 + 0.02;
      }
    } else {
      this.yMax = 0.10;
    }

    this.draw();
  };

  RateTempChart.prototype.draw = function () {
    this.clear();
    this.drawAxes();

    var ctx = this.ctx;

    // Draw theoretical Arrhenius curve if engine is available
    if (this.theoreticalEngine) {
      ctx.save();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();

      // Use current slider values for concentration to plot a theoretical curve
      var engine = this.theoreticalEngine;
      var startTemp = this.xMin;
      var startRate = 1.0 / engine.predictBlotOutTime(engine.thioConc, engine.thioVol, engine.waterVol, engine.acidType, engine.acidConc, engine.acidVol, startTemp);
      if (isFinite(startRate)) {
        var startPt = this.toScreenCoords(startTemp, startRate);
        ctx.moveTo(startPt.x, startPt.y);
      }

      for (var t = this.xMin + 1; t <= this.xMax; t++) {
        var rate = 1.0 / engine.predictBlotOutTime(engine.thioConc, engine.thioVol, engine.waterVol, engine.acidType, engine.acidConc, engine.acidVol, t);
        if (isFinite(rate)) {
          var pt = this.toScreenCoords(t, rate);
          if (t === this.xMin + 1 && !isFinite(startRate)) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // Draw recorded data points
    this.points.forEach(function (pt) {
      var scr = this.toScreenCoords(pt.temp, pt.rate);
      ctx.save();
      ctx.fillStyle = this.themeColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(scr.x, scr.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }, this);
  };


  // 3. Rate vs. Concentration Chart
  function RateConcChart(canvas, xLabel, yLabel) {
    BaseChart.call(this, canvas, xLabel, yLabel, 0, 0.20, 0, 0.10, '#3b82f6');
    this.points = []; // Array of {conc, rate}
    this.theoreticalEngine = null;
  }
  RateConcChart.prototype = Object.create(BaseChart.prototype);
  RateConcChart.prototype.constructor = RateConcChart;

  RateConcChart.prototype.updatePoints = function (points, engine) {
    this.points = points;
    this.theoreticalEngine = engine;

    // Dynamically scale Y-axis limit if rates are high
    if (this.points.length > 0) {
      var maxRate = Math.max.apply(Math, this.points.map(function (p) { return p.rate; }));
      if (maxRate > this.yMax) {
        this.yMax = Math.ceil(maxRate * 100) / 100 + 0.02;
      }
    } else {
      this.yMax = 0.10;
    }

    this.draw();
  };

  RateConcChart.prototype.draw = function () {
    this.clear();
    this.drawAxes();

    var ctx = this.ctx;

    // Draw theoretical linear curve if engine is available
    if (this.theoreticalEngine) {
      ctx.save();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();

      var engine = this.theoreticalEngine;
      var totalVol = parseFloat(engine.thioVol) + parseFloat(engine.waterVol) + parseFloat(engine.acidVol);
      var thioVol = parseFloat(engine.thioVol);

      var startConc = this.xMin;
      var equivStartConc = thioVol > 0 ? (startConc * totalVol) / thioVol : 0;
      var startRate = 1.0 / engine.predictBlotOutTime(equivStartConc, engine.thioVol, engine.waterVol, engine.acidType, engine.acidConc, engine.acidVol, engine.temperature);
      if (isFinite(startRate)) {
        var startPt = this.toScreenCoords(startConc, startRate);
        ctx.moveTo(startPt.x, startPt.y);
      }

      var steps = 20;
      for (var i = 1; i <= steps; i++) {
        var c = this.xMin + (this.xMax - this.xMin) * (i / steps);
        var equivConc = thioVol > 0 ? (c * totalVol) / thioVol : 0;
        var rate = 1.0 / engine.predictBlotOutTime(equivConc, engine.thioVol, engine.waterVol, engine.acidType, engine.acidConc, engine.acidVol, engine.temperature);
        if (isFinite(rate)) {
          var pt = this.toScreenCoords(c, rate);
          if (i === 1 && !isFinite(startRate)) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // Draw recorded data points
    this.points.forEach(function (pt) {
      var scr = this.toScreenCoords(pt.conc, pt.rate);
      ctx.save();
      ctx.fillStyle = this.themeColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(scr.x, scr.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }, this);
  };

  return {
    TransmissionChart: TransmissionChart,
    RateTempChart: RateTempChart,
    RateConcChart: RateConcChart
  };
})();