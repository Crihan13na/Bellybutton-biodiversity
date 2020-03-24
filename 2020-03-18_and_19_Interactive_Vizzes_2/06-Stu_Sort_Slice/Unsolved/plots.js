// Sort the data by Greek search results

// Sort the array in ascending order, using an arrow function
var sortedByGreekSearch = data.sort((a,b) => b.greekSearchResults - a.greekSearchResults);
console.log(sortedByGreekSearch);

// Slice the first 10 objects for plotting
// Slice the first two names
slicedData  = sortedByGreekSearch.slice(1,10);
// Returns elements at index position 0 and 1, but not 2.
console.log(slicedData);


// Reverse the array to accommodate Plotly's defaults
reversedArray = slicedData.reverse();
console.log(reversedArray);

// Trace1 for the Greek Data
var trace1 = {
    x: reversedArray.map(object => object.greekSearchResults),
    y: reversedArray.map(object => object.greekName),
    text: reversedArray.map(object => object.greekName),
    name: "Greek",
    type: "bar",
    orientation: "h"
  };
// data
var data = [trace1];

// Apply the group bar mode to the layout
var layout = {
    title: "Greek gods search results",
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
  };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("plot", data, layout);