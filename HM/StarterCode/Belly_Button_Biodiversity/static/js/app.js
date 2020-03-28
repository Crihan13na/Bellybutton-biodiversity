InitDashboard();

function InitDashboard() 
{

    //console.log("Initializing Dashboard");
    // Reference dropdown menu and store in a variable called 'selector'
    var selector = d3.select("#selDataset");
    // Fetch the JSON data
    d3.json("samples.json").then((data) => {
         
        //console.log(data);
        // Create variable to hold all the names
        var sampleNames = data.names;

        //console.log(data.names);
        // Modify the selector for each name
        sampleNames.forEach((sampleId) => 
        {
            // Add 'option' tag
            selector.append("option")
            // Text displayed on user interface
            .text(sampleId)
            // Add 'value' attribute to each tag and assign 'sample' to it
            .property("value", sampleId);
        });
        // Pick first name to be the default data for our graphs
        var sampleId = sampleNames[0];

        DrawBubblechart(sampleId);
        DrawBargraph(sampleId);
        DrawGauge(sampleId);
        ShowMetadata(sampleId);
    });
        
 }


 
 function optionChanged(newSampleId) 
 {
     // Function to build the tables with user input
     //console.log(`User selected ${newSampleId}`);
 
     DrawBubblechart(newSampleId);
     DrawBargraph(newSampleId);
     DrawGauge(newSampleId);
     ShowMetadata(newSampleId);
 }
 
 
 
 function ShowMetadata(sampleId)
{
    // Create function to populate 'Demographic Info' table
    //console.log(`calling ShowMetadata(${sampleId})`);
    // Fetch the JSON data
    d3.json("samples.json").then((data) => {
        // Create variable to hold all the metadata
        var metadata = data.metadata;
        var resultArray = metadata.filter(m => m.id == sampleId);
        var result = resultArray[0];
        // Reference location to put metadata and place into variable 'panel'
        var Panel = d3.select(`#sample-metadata`);
        // First empty out any data in that location
        Panel.html(``);

        Object.entries(result).forEach(([key, value]) => {
            Panel.append(`h6`)
            .text(`${key.toUpperCase()}: ${value}`);
        });

    });
}




function DrawBargraph(sampleId)
{
    //console.log(`calling DrawBargraph(${sampleId})`);
     // Fetch JSON data
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        // Within 'samples' from samples.json, find the id that 
        //matches the user input (=sampleId) in drop down menu
        var resultArray = samples.filter(s => s.id == sampleId);
        var result = resultArray[0];
      

        var otu_ids = result.otu_ids;
       // console.log(` data for otu_ids ${otu_ids}`);
        var otu_labels = result.otu_labels;
        //console.log(` data for otu_labels ${otu_labels}`);
        var sample_values = result.sample_values;
        //console.log(` data for sample_values ${sample_values}`);
        // Want bar chart of top 10, highest on top; need to slice and reverse
        yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
       // console.log(yticks);

        var barData = {
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            type: "bar",
            text: otu_labels.slice(0,10).reverse(),
            orientation: "h"
        }

        barArray = [barData];

        var barLayout = {
            title: "Top 10 bacteria cultures found",
            margin: {t: 30, l: 150}

        };

        Plotly.newPlot("bar", barArray, barLayout);

    });
}




function DrawBubblechart(sampleId)
{
    //console.log(`calling DrawBubblechart(${sampleId})`);
    //reading data
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(s => s.id == sampleId);
        var result = resultArray[0];
      
        var otu_ids = result.otu_ids;
       // console.log(` data for otu_ids ${otu_ids}`);
        var otu_labels = result.otu_labels;
        //console.log(` data for otu_labels ${otu_labels}`);
        var sample_values = result.sample_values;
        //console.log(` data for sample_values ${sample_values}`);

        yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
       // console.log(yticks);


    var bubbleLayout = {
        title: 'Vactera Cultures Per Sample',
        margin: {t: 0 },
        hovermode: 'closest',
        xaxis: { title: 'OTU ID'},
        margin: { t: 30}
    };
    var bubbleData = [
        {
            x: otu_ids,
            y: yticks,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            }
        }
    ];

    Plotly.newPlot('bubble',bubbleData,bubbleLayout);
});

}




function DrawGauge(sampleId) {
{
    //console.log(`calling DrawGauge(${sampleId})`); 
    d3.json('samples.json').then(data => {
            var metadata = data.metadata;
            var resultArray = metadata.filter(sampleObj => sampleObj.id == sampleId);
            var result = resultArray[0];
            var washFreq = result.wfreq;
            console.log("GAUGE washFreq:", washFreq);
            
            var data = [
                {
                domain: { x: [0, 1], y: [0, 1]},
                value: washFreq,
                title: { text: "Hand Wash Freq", font: { size: 24 } },
                type: "indicator",
                mode: "gauge+number",
                gauge: { 
                    axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" }, 
                    bar: { color: "red" },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                        { range: [0, 1], color: "#33cca6"},
                        { range: [1, 2], color: "#33cccc" },
                        { range: [2, 3], color: "#33a6cc" },
                        { range: [3, 4], color: "#3380cc" },
                        { range: [4, 5], color: "#3359cc" },
                        { range: [5, 6], color: "#3333cc" },
                        { range: [6, 7], color: "#5933cc" },
                        { range: [7, 8], color: "#8033cc" },
                        { range: [8, 9], color: "#a633cc" } 
                    ],
                }
         }
     ];

     var layout = { 
         width: 465, 
         height: 400, 
         margin: { t: 25, r: 25, l: 25, b: 25 },
         //paper_bgcolor: "black",
         font: {
             color: "earth",
             //family: "Arial"
             }
     };
     Plotly.newPlot("gauge", data, layout);
 });
}
    

}



