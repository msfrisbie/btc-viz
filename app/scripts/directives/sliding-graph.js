angular.module('blockchainMonitorApp')
.directive('slidingGraph', function() {
  return {
    restrict: 'A',
    scope: {
      trackData: '='
    },
    link: function(scope, element, attrs) {

      var min_y = 200
        , max_y = 300;

      var n = 100
          // random = d3.random.normal(200),

        , data = d3.range(n).map(function() {return 200.0;})
        // , avgdata = d3.range(n).map(function() {return 200.0;});

      var x, y, line, avgline, svg, path, avgpath, newAvg;

      var margin = {top: 20, right: 20, bottom: 20, left: 40},
          width = 500 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

      function redraw() {
        x = d3.scale.linear()
            .domain([1, n - 2])
            .range([0, width]);

        y = d3.scale.linear()
            // .domain([min_y, max_y])
            .domain([min_y - 20, max_y + 20])
            .range([height, 0]);

        line = d3.svg.line()
            .interpolate("basis")
            .x(function(d, i) { return x(i); })
            .y(function(d, i) { return y(d); });

        // avgline = d3.svg.line()
        //     .interpolate("basis")
        //     .x(function(d, i) { return x(i); })
        //     .y(function(d, i) { return y(d); });

        if (svg)
          svg.selectAll("*").remove();

        svg = d3.select(element[0])
        // console.log(d3.select(element))
        // svg = d3.select(element[0])
            // .remove()
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
          .append("rect")
            .attr("width", width)
            .attr("height", height);

        // svg.append("g")
        //     .attr("class", "x axis")
        //     .attr("transform", "translate(0," + y(0) + ")")
        //     .call(d3.svg.axis().scale(x).orient("bottom"));

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis().scale(y).orient("left"));

        path = svg.append("g")
            .attr("clip-path", "url(#clip)")
          .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        // avgpath = svg.append("g")
        //     .attr("clip-path", "url(#clip)")
        //   .append("avgpath")
        //     .datum(avgdata)
        //     .attr("class", "avgline")
        //     .attr("d", avgline);

      }

      redraw();

      tick();

      function tick() {

        // push a new data point onto the back
        // if (scope.trackData.buffer.length > 0) {

        var newVal = parseFloat(scope.trackData.buffer.pop(0));
          // , lastVal = scope.trackData.last20[scope.trackData.last.length - 1];

        console.log(newVal)

        // if (scope.trackData.last === 0.0) {
        // scope.trackData.last = newVal;
          // } else if {
            // if (newVal === 0 || (newVal/lastVal > 0.5 && newVal/lastVal < 1.5)) {
              // scope.trackData.last = newVal;
            // }
          // }
        // }

        if (scope.trackData.last20.length > 0) {
          var total = 0.0;
          for (var i=0; i<scope.trackData.last20.length; i++) {
            total += scope.trackData.last20[i];
          }

          newAvg = total / parseFloat(scope.trackData.last20.length);
        }

        // console.log(newAvg)

        var new_min_y = data[0]
          , new_max_y = data[0];

        for (var i=0; i<data.length; i++) {
          if (data[i] < new_min_y) {
            new_min_y = data[i];
          } else if(data[i] > new_max_y) {
            new_max_y = data[i];
          }
        }

        if (new_min_y != min_y || new_max_y != max_y) {
          max_y = new_max_y;
          min_y = new_min_y;
          // y = d3.scale.linear()
          //   .domain([min_y - 20, max_y + 20])
          //   .range([height, 0]);

          redraw();
        }


        // console.log(scope.trackData.last)
        if (newVal)
          data.push(newVal);
        else
          data.push(data[data.length-1])
        // if (newAvg)
        //   avgdata.push(newAvg)

        // redraw the line, and slide it to the left
        path
            .attr("d", line)
            .attr("transform", null)
          .transition()
            .duration(200)
            .ease("linear")
            .attr("transform", "translate(" + x(0) + ",0)")
            // .each("end", tick);
            .each("end", tick);


        // avgpath
        //     .attr("d", avgline)
        //     .attr("transform", null)
        //   .transition()
        //     .duration(200)
        //     .ease("linear")
        //     .attr("transform", "translate(" + x(0) + ",0)")
        //     .each("end", tick);

        // pop the old data point off the front
        // if (newVal)
        data.shift();
        // if (newAvg)
        //   avgdata.shift();

        // console.log(data)

      }
    }
  }
})