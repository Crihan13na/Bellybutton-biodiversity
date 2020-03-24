const url = "https://api.spacexdata.com/v2/launchpads";

//annonymous function
d3.json(url).then(function(data) {
    //insisde of here, I can do anything with data
     console.log(data);
});

d3.json(url).then(preocessData);
function processData(data);

