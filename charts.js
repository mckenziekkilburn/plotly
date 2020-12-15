function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    //console.log(result.wfreq)
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      PANEL.append("h6").text("ID:" + result.id);
      PANEL.append("h6").text("Ethnicity:" + result.ethnicity);
      PANEL.append("h6").text("Gender:" + result.gender);
      PANEL.append("h6").text("Age:" + result.age);
      PANEL.append("h6").text("Location:" + result.location);
      PANEL.append("h6").text("BBType:" + result.bbtype);
      PANEL.append("h6").text("WFREQ:" + result.wfreq);

  });
}
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // console.log(samples);
    // Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    // 2. Create a variable that holds the first sample in the metadata array.
    var metadata = metadataArray[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    // 3. Create a variable that holds the washing frequency.
    var frequency = parseFloat(metadata.wfreq);
//     // 7. Create the yticks for the bar chart.
//     // Hint: Get the the top 10 otu_ids and map them in descending order  
//     //  so the otu_ids with the most bacteria are last. 
    
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ,(${otuID}`).reverse();
     //console.log(yticks)
     // 8. Create the trace for the bar chart. 
    var barData = [
     {
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
      backgroundcolor: "red"
    }];
  
     // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 100, l: 100 }
     
    };
     // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  

     // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_ids,
      y: sample_values,
      type: "bubble",
      text: otu_labels,
      mode: "markers",
      marker: {size: sample_values, color: otu_ids, colorscale: "Blues"}
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      margin: { t: 100, l: 100 },
      hovermode: 'closest',
      xaxes: { title: "OTU ID"},
      
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
    //result.wfreq = 0
    
     // 4. Create the trace for the gauge chart. 
    var gaugeData = {
      value: frequency,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b>Belly Button Washing Frequency</b><br>Sub"},
      gauge: {
        axis: { range: [null,10]},
        bar: { color: "snow"},
        steps: [
          { range: [0, 2], color: "midnightblue"},
          { range: [2, 4], color: "mediumblue"},
          { range: [4, 60], color: "royalblue"},
          { range: [6, 8], color: "cornflowerblue"},
          { range: [8, 10], color: "lightskyblue"}
        ],
      }
   };
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     width: 500,
     height: 400,
     margin: { t: 25, r: 25, l: 25, b: 25 },

    };
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout)
  });
}
  
