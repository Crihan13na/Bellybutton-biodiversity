function DrawBargraph(sampleId)
{
    console.log(`calling DrawBargraph(${sampleId})`);
}



function DrawBubblechart(sampleId)
{
    console.log(`calling DrawBubblechart(${sampleId})`);
}



function ShowMetadata(sampleId)
{
    console.log(`calling ShowMetadata(${sampleId})`)
}



function optionChanged(newSampleId) 
{
    console.log(`User selected ${newSampleId}`);

    DrawBubblechart(newSampleId);
    DrawBargraph(newSampleId);
    ShowMetadata(newSampleId);
}


function InitDashboard() 
{

    console.log("Initializing Dashboard");

    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => 
    {
         
        console.log(data);

        var sampleNames = data.names;

        console.log(data.names);

        sampleNames.forEach((sampleId) => 
        {

            selector.append("option")
            .text(sampleId)
            .property("value", sampleId);
        });
        
    });
        
 }

    


InitDashboard();