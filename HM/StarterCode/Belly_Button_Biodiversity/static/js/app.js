InitDashboard();

function InitDashboard() 
{

    //console.log("Initializing Dashboard");

    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
         
        //console.log(data);

        var sampleNames = data.names;

        //console.log(data.names);

        sampleNames.forEach((sampleId) => 
        {
            selector.append("option")
            .text(sampleId)
            .property("value", sampleId);
        });
        
        var sampleId = sampleNames[0];

        DrawBubblechart(sampleId);
        DrawBargraph(sampleId);
        DrawGauge(sampleId);
        ShowMetadata(sampleId);
    });
        
 }


 
 function optionChanged(newSampleId) 
 {
     //console.log(`User selected ${newSampleId}`);
 
     DrawBubblechart(newSampleId);
     DrawBargraph(newSampleId);
     DrawGauge(newSampleId);
     ShowMetadata(newSampleId);
 }
 
 
 
 function ShowMetadata(sampleId)
{
    //console.log(`calling ShowMetadata(${sampleId})`);

    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(m => m.id == sampleId);
        var result = resultArray[0];
        var Panel = d3.select(`#sample-metadata`);
        Panel.html(``);

        Object.entries(result).forEach(([key, value]) => {
            Panel.append(`h6`)
            .text(`${key.toUpperCase()}: ${value}`);
        });

    });
}




function DrawBargraph(sampleId)
{
    console.log(`calling DrawBargraph(${sampleId})`);
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




function DrawGauge(sampleId)
{
    console.log(`calling DrawGauge(${sampleId})`);
}



