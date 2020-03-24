function buildMetadata(sample) {
    // Use `d3.json` to fetch the metadata for a sample
    var metadata = d3.select("#sample-metadata");
    var url = "/metadata/" + sample;
    // document.getElementById("#sample-metadata").innerHTML = "";
    d3.json(url).then(function(response) {
      console.log(response);
      $("#sample-metadata").empty();
      Object.entries(response).forEach(([key, value]) => metadata.append("h5").text(`${key}: ${value}`));
    });
  }
  
  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
  function buildGauge(sample) {
    var url = "/metadata/" + sample;
    d3.json(url).then(function(response) {
      console.log(response.WFREQ);
      var wfreq = response.WFREQ;
      // Enter the washing frequency between 0 and 180
      var level = parseFloat(wfreq) * 20;
      // Trig to calc meter point
      var degrees = 180 - level;
      var radius = 0.5;
      var radians = (degrees * Math.PI) / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
  
      // Path: may have to change to create a better triangle
      var mainPath = "M -.0 -0.05 L .0 0.05 L ";
      var pathX = String(x);
      var space = " ";
      var pathY = String(y);
      var pathEnd = " Z";
      var path = mainPath.concat(pathX, space, pathY, pathEnd);
  
      var data = [
        {
          type: "scatter",
          x: [0],
          y: [0],
          marker: { size: 12, color: "850000" },
          showlegend: false,
          name: "Freq",
          text: level,
          hoverinfo: "text+name"
        },
        {
          values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
          rotation: 90,
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: "text",
          textposition: "inside",
          marker: {
            colors: [
              "rgba(0, 105, 11, .5)",
              "rgba(10, 120, 22, .5)",
              "rgba(14, 127, 0, .5)",
              "rgba(110, 154, 22, .5)",
              "rgba(170, 202, 42, .5)",
              "rgba(202, 209, 95, .5)",
              "rgba(210, 206, 145, .5)",
              "rgba(232, 226, 202, .5)",
              "rgba(240, 230, 215, .5)",
              "rgba(255, 255, 255, 0)"
            ]
          },
          labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          hoverinfo: "label",
          hole: 0.5,
          type: "pie",
          showlegend: false
        }
      ];
  
      var layout = {
        shapes: [
          {
            type: "path",
            path: path,
            fillcolor: "850000",
            line: {
              color: "850000"
            }
          }
        ],
        margin: {
          l: 10,
          r: 10,
          b: 10,
          t: 200,
          pad: 4
        },
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        height: 600,
        width: 600,
        xaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        },
        yaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        }
      }
        var GAUGE = document.getElementById("gauge");
        Plotly.newPlot(GAUGE, data, layout);
    });
  }
  
  function buildCharts(sample) {
    var url = "/samples/" + sample;
    d3.json(url).then(function(response) {
      console.log(response);
      var filtered_values = [];
      var filtered_otu_ids = [];
      var filtered_otu_labels = [];
      var len = response.sample_values.length;
      var indices = new Array(len);
      for (var i = 0; i < len; i++) {
        indices[i] = i;
        indices.sort(function (a, b) { return response.sample_values[a] < response.sample_values[b] ? 1 : response.sample_values[a] > response.sample_values[b] ? -1 : 0; });
      }    
      for (var i =0; i<10; i++){
        var j = indices[i];
        filtered_values.push(response.sample_values[j]);
        filtered_otu_ids.push(response.otu_ids[j]);
        filtered_otu_labels.push(response.otu_labels[j]);
      }
    
      var layout1 = {
        annotations: [
          {
            font: {
              size: 15
            },
            showarrow: false,
            text: "Top 10 Samples",
            x: 0.3,
            y: 0.5
          }
        ],
        height: 500,
        width: 500
      };
      var trace1 = [{
        type: "pie",
        values: filtered_values,
        labels: filtered_otu_ids.map(String),
        text: filtered_otu_labels,
        hole: .4,
        textinfo: 'percent'
      }];
      console.log(trace1);
      var PIE = document.getElementById('bar');
      Plotly.newPlot(PIE, trace1, layout1);
  
      var trace2 = [{
        x: response.otu_ids,
        y: response.sample_values,
        text: response.otu_labels,
        mode: 'markers',
        marker: {
          color:response.otu_ids,
          size: response.sample_values
        }
      }];
      var layout2 = {
        title: 'Bubble chart for each sample',
        showlegend: false,
        height: 600,
        width: 1400
      };
      console.log(trace2);
      Plotly.newPlot('bubble', trace2, layout2);
    });
  }
  
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
      buildGauge(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
    buildGauge(newSample);
  }
  
  $('select').on('change', function() {
    var Sample = d3.select("#selDataset").property('value');
    console.log( Sample );
    optionChanged(Sample);
  });
  
  // Initialize the dashboard
  init();
  //https://github.com/jing0703/Belly_Button_Biodiversity_Analysis






//        // Initializes the page with a default plot
// function init() {
//     trace = [{
//       x: [1, 2, 3, 4, 5],
//       y: [1, 2, 4, 8, 16] }];

//       data = [trace];
//     var CHART = d3.selectAll("#plot").node();

//     Plotly.newPlot(CHART, data);
//   }

//   // Call updatePlotly() when a change takes place to the DOM
//   d3.selectAll("body").on("change", updatePlotly);

//   // This function is called when a dropdown menu item is selected
//   function updatePlotly() {
//     // Use D3 to select the dropdown menu
//     var dropdownMenu = d3.select("#selDataset");
//     // Assign the value of the dropdown menu option to a variable
//     var dataset = dropdownMenu.node().value;

//     var CHART = d3.selectAll("#plot").node(); //

//     // Initialize x and y arrays
//     var x = [];
//     var y = [];

//     switch(dataset) {
//       case "dataset1":
//         x = [1, 2, 3, 4, 5];
//         y = [1, 2, 4, 8, 16];
//         break;

//       case "dataset2":
//         x = [10, 20, 30, 40, 50];
//         y = [1, 10, 100, 1000, 10000];
//         break;

//       case "dataset3":
//         x = [100, 200, 300, 400, 500];
//         y = [10, 100, 50, 10, 0];
//         break;

//       default:
//         x = [1, 2, 3, 4, 5];
//         y = [1, 2, 3, 4, 5];
//         break;
//     }


//     // Note the extra brackets around 'x' and 'y'
//     Plotly.restyle(CHART, "x", [x]);
//     Plotly.restyle(CHART, "y", [y]);
//   }

//   init();




// // Horizontal bar chart

//   // Sort the data by Greek search results
// var sortedByGreekSearch = data.sort((a, b) => b.greekSearchResults - a.greekSearchResults);

// // Slice the first 10 objects for plotting
// slicedData = sortedByGreekSearch.slice(0, 10);

// // Reverse the array to accommodate Plotly's defaults
// reversedData = slicedData.reverse();

// // Trace1 for the Greek Data
// var trace1 = {
//   x: reversedData.map(object => object.greekSearchResults),
//   y: reversedData.map(object => object.greekName),
//   text: reversedData.map(object => object.greekName),
//   name: "Greek",
//   type: "bar",
//   orientation: "h"
// };

// // data
// var data = [trace1];

// // Apply the group bar mode to the layout
// var layout = {
//   title: "Greek gods search results",
//   margin: {
//     l: 100,
//     r: 100,
//     t: 100,
//     b: 100
//   }
// };

// // Render the plot to the div tag with id "plot"
// Plotly.newPlot("plot", data, layout);