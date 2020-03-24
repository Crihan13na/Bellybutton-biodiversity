
   
// Create our first trace
var trace1 = {
 x: data.map(row => row.pair),
 y: data.map(row => row.greekSearchResults),
 text: data.map(row => row.greekName),
 name: "Greek",
 type: "bar"
};

// Create our second trace
var trace2 = {
    x: data.map(row => row.pair),
    y: data.map(row => row.romanSearchResults),
    text: data.map(row => row.romanName),
    name: "Roman",
    type: "bar"
};

// The data array consists of both traces
var data = [trace1, trace2];
var layout = {
    title: "Greek vs Roman Gods",
    barmode: "group"
};
Plotly.newPlot("plot", data, layout);
// Note that we omitted the layout object this time
// This will use default parameters for 