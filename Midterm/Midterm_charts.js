/**
 * @author [Nguyen Hoang Tai Minh]
 * @email [ng.h.taiminh@mail.com]
 * @desc [Midterm - Course: Data Science and Data Visualization - Year: 2019 - 2020]
 */

d3.csv(
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
  function (error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      // Add a column named "label" includes province name and country name as labels for the bars.
      for (var idx = 0; idx < data.length; idx++) {
        if (data[idx]["Province/State"].length != 0) {
          data[idx]["label"] =
            data[idx]["Province/State"] +
            "," +
            data[idx]["Country/Region"];
        } else {
          data[idx]["label"] = data[idx]["Country/Region"];
        }
      }
      // Choose only non-zero row on "1/22/20" column with filter function
      var dataset = data.filter(function (d) {
        return d["1/22/20"] != 0;
      });
      console.log(dataset);
      //console.log(data)
      question1(dataset);
      question2(dataset);
      question3(data);
    }
  }
);
/** Question 1:Draw a horizontal bar chart to show COVID confirmed cases over the world on “1/22/2020”. Your chart should
a.	Have a fixed size (use scale to convert data) done
b.	Have axis with title and ticks done
c.	Use Province/State and Country/Region as key/label for a row done
d.	Show only non-zero rows (Use filter function of arrays in javascript) done
e.	Show value in the bar
 * @param {*} dataset 
 */
function question1(dataset) {
  //console.log(d3.max(dataset, function(d){return parseInt(d["1/22/20"])}))
  var w = 600;
  var h = 500;
  var margin = { top: 100, right: 70, bottom: 50, left: 150 };
  var outerWidth = w + margin.right + margin.left;
  var outerHeight = h + margin.top + margin.bottom;
  padding = 1;

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // Make the axis with fixed size
  var xScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return parseInt(d["1/22/20"]);
      }),
    ])
    .range([0, w]);
  var xAxis = d3.axisBottom().scale(xScale);
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
  var yScale = d3
    .scaleBand()
    .range([0, h])
    .domain(
      dataset.map(function (d) {
        return d["label"];
      })
    )
    .padding(0.1);

  var yAxis = d3.axisLeft().scale(yScale);
  svg.append("g").attr("class", "y axis").call(yAxis);

  // Add the bars
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", xScale(0))
    .attr("y", function (d) {
      return yScale(d["label"]);
    })
    .attr("width", function (d) {
      return xScale(parseInt(d["1/22/20"]));
    })
    .attr("height", yScale.bandwidth())
    .attr("text-anchor", "end")
    .attr("fill", "steelblue");

  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function (d) {
      return d["1/22/20"];
    })
    .attr("class", "value")
    .attr("x", function (d) {
      return xScale(parseInt(d["1/22/20"]));
    })
    .attr("y", function (d) {
      return yScale(d["label"]) + yScale.rangeBand() / 2 + 4;
    })
    .attr("fill", "black");

  svg.append("text") //  x-axis label
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", w)
    .attr("y", h + 50)
    .attr("font-size", 17)
    .attr("font-family", "sans-serif")
    .text("Confirmed Case");
  svg.append("text") //  y-axis label
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", -100)
    .attr("transform", "rotate(-90)")
    .attr("font-size", 17)
    .attr("font-family", "sans-serif")
    .text("Province/Country");

  svg.append("text") // Add tittle
    .attr("class", "title")
    .attr("text-anchor", "middle")
    .attr("x", margin.left + 120)
    .attr("y", -50)
    .attr("transform", "rotate(360)")
    .attr("font-size", 13)
    .attr("font-family", "sans-serif")
    .text(
      "The horizontal bar chart of the numbers of confirmed case all around the word on 22nd Jan, 2020"
    )
    .attr("font-weight", "bold");
}

/** Question2: Draw a scatter plot chart of size 1024x600 to show COVID confirmed cases over the world on “1/22/2020” where
a.	Regions/country are shown in correct position as in the real map
        X-Axis encodes the longitude (Long attribute), 
        Y-Axis encodes the latitude (Lat attribute) of the region
b.	Each item represented by a circle. 
c.	The radius of a circle encodes the number of confirmed cases at the province/region
d.	Circle should have a solid border, and fill will color but with opacity to mitigate the overlapping problem
e.	Circle should have label 

 * 
 * @param {*} dataset 
 */

function question2(dataset) {
  var w = 1024;
  var h = 600;
  var margin = { top: 100, right: 0, bottom: 130, left: 80 };
  var outerHeight = h + margin.top + margin.bottom;
  var outerWidth = w + margin.right + margin.left;
  var padding = 20;

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight);
  // According to the Earth's coordinates, the longitude has X-coordinate between -180 and 180 degrees
  var xScale = d3
    .scaleLinear()
    .domain([-180, 180])
    .range([0, w - padding]);
  // The latitude has Y-coordinates between -90 and 90 degrees
  var yScale = d3
    .scaleLinear()
    .domain([-90, 90])
    .range([h - padding, 0]);
  var rScale = d3
    .scaleSqrt()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return parseInt(d["1/22/20"]);
      }),
    ])
    .range([1, 25]);

  // Add the data points on the scatter plot
  svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(parseFloat(d["Long"])) + margin.left;
    })
    .attr("cy", function (d) {
      return yScale(d["Lat"]) + margin.top + padding;
    })
    .attr("r", function (d) {
      return rScale(parseInt(d["1/22/20"]));
    })
    .attr("stroke", "red")
    .attr("stroke-width", 0.3)
    .attr("fill", "#DE849D")
    .attr("fill-opacity", 0.6);
  // Add label for the data points
  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("x", function (d) {
      return xScale(parseFloat(d["Long"])) + margin.left + 5;
    })
    .attr("y", function (d) {
      return yScale(parseFloat(d["Lat"])) + margin.top + padding;
    })
    .text(function (d) {
      return d["label"];
    })
    .attr("font-size", "4px")
    .attr("font-family", "sans-serif")
    .attr("fill", "black");

  // Add the axis
  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale);
  g.append("g")
    .attr("transform", "translate(0," + (margin.top - margin.left) + ")")
    .call(yAxis);
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);

  // Add axis's label
  g.append("text") //  x-axis label
    .attr("text-anchor", "end")
    .attr("x", w - 20)
    .attr("y", h + 50)
    .attr("font-size", 17)
    .attr("font-family", "sans-serif")
    .text("Longitude");
  g.append("text") //  y-axis label
    .attr("text-anchor", "end")
    .attr("x", -20)
    .attr("y", -50)
    .attr("transform", "rotate(-90)")
    .attr("font-size", 17)
    .attr("font-family", "sans-serif")
    .text("Latitude");
  g.append("text")
    .attr("text-anchor", "middle")
    .attr("x", margin.left + 400)
    .attr("y", 0)
    .attr("transform", "rotate(360)")
    .attr("font-size", 17)
    .attr("font-family", "sans-serif")
    .text(
      "The scatter plot of confirmed case all around the word on 22nd Jan, 2020"
    )
    .attr("font-weight", "bold");
}

/** Question 3: ) Draw a horizontal bar chart with transition to show the spreading of COVID. The chart has the same requirement in question 1 and
a.	(5pts) Have button to move back and forth between data on the following days: “1/22/2020”, “1/29/2020”, “2/5/2020”, “2/12/2020”, “2/19/2020”, “2/26/2020”, “3/4/2020”, “3/11/2020”, “3/18/2020”, “3/25/2020”, “4/1/2020” and “4/8/2020”
b.	(10pts) Use transition to highlight the adding and the removing of item in the chart. (No effects should be applied to the existing data)
c.	(5pts) Sort items by number of confirmed cases
  
 * @param {*} dataset 
 */
function question3(dataset) {
  var datasetTemp = dataset.filter(function (d) {
    return d["1/22/20"] != 0;
  });

  datasetTemp = datasetTemp.sort(function (a, b) {
    const countryA = parseInt(a["1/22/20"]);
    const countryB = parseInt(b["1/22/20"]);
    if (countryA > countryB) return -1;
    else if (countryA < countryB) return 1;
    else return 0;
  });

  var w = 1000;
  var h = 550;
  var margin = { top: 100, right: 20, bottom: 100, left: 150 };
  var outerWidth = w + margin.right + margin.left;
  var outerHeight = h + margin.top + margin.bottom;
  padding = 1;

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // Add the axis
  var xScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(datasetTemp, function (d) {
        return parseInt(d["1/22/20"]);
      }),
    ])
    .range([0, w]);
  var xAxis = d3.axisBottom().scale(xScale);
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  var yScale = d3
    .scaleBand()
    .range([0, h])
    .domain(
      datasetTemp.map(function (d) {
        return d["label"];
      })
    )
    .padding(0.1);
  var yAxis = d3.axisLeft().scale(yScale);
  svg.append("g").attr("class", "y axis").call(yAxis);
  // Add bars
  svg.selectAll("rect")
    .data(datasetTemp)
    .enter()
    .append("rect")
    .attr("x", xScale(0))
    .attr("y", function (d) {
      return yScale(d["label"]);
    })
    .attr("width", function (d) {
      return xScale(parseInt(d["1/22/20"]));
    })
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");

  svg.append("text") //  x-axis label
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", w)
    .attr("y", h + 50)
    .attr("font-size", 17)
    .attr("font-family", "sans-serif")
    .text("Confirmed Case");
  svg.append("text") //  y-axis label
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", -100)
    .attr("transform", "rotate(-90)")
    .attr("font-size", 17)
    .attr("font-family", "sans-serif")
    .text("Province/Country");
  svg.append("text") // tittle
    .attr("class", "title")
    .attr("text-anchor", "middle")
    .attr("x", margin.left + 170)
    .attr("y", -50)
    .attr("transform", "rotate(360)")
    .attr("font-size", 13)
    .attr("font-family", "sans-serif")
    .text(
      "Top 50 Provinces/Countries with highest numbers of confirmed case all around the word on: "
    )
    .attr("font-weight", "bold");

  var index = 0; //  To get the date in displayDate array
  // On click event, move to the next or previous date by clicking the nextDate and previousDate respectively.
  d3.selectAll("button").on("click", function () {
    var newDataset = [];
    var buttonID = d3.select(this).attr("id");
    var displayDate = [
      "1/22/20",
      "1/29/20",
      "2/5/20",
      "2/12/20",
      "2/19/20",
      "2/26/20",
      "3/4/20",
      "3/11/20",
      "3/18/20",
      "3/25/20",
      "4/1/20",
      "4/8/20",
    ];

    if (buttonID == "forward" && index < displayDate.length - 1) {
      index += 1;
    } else if (buttonID == "backward" && index > 0) {
      index -= 1;
    }

    // Display the date in the chart on the page
    document.getElementById("displayDate").innerHTML =
      displayDate[index] + "20";

    // Get rid of the zero value
    var newDataset = dataset.filter(function (d) {
      return d[displayDate[index]] != 0;
    });

    // Sorting item by the number of confirmed case in DESCENDING order
    newDataset = newDataset.sort(function (a, b) {
      const countryA = parseInt(a[displayDate[index]]);
      const countryB = parseInt(b[displayDate[index]]);
      if (countryA > countryB) return -1;
      else if (countryA < countryB) return 1;
      else return 0;
    });
    /**
     * For this chart, I choose only display top 50 country/province with highest number of confirmed case.
     * Because when move to latter date, there're so many countries with small value and some countries
     *  with really high value, so the scale is changed to fit the high ones so we couldn't see the small one.
     * Another reason is I also need to change the height to larger number so the labels on the y-axis are not
     * overlap to each other in latter date, but doing that we cant see the changes of the whole chart.
     * => It not a good visualization
     * => I only show top 50 countries so we can see the changes more clearly.
     */
    newDataset = newDataset.slice(0, 50);
    // Update the scale
    xScale.domain([
      0,
      d3.max(newDataset, function (d) {
        return parseInt(d[displayDate[index]]);
      }),
    ]);
    yScale.domain(
      newDataset.map(function (d) {
        return d["label"];
      })
    );

    // Update the chart
    var bars = svg.selectAll("rect").data(newDataset);

    bars.enter()
      .append("rect")
      .attr("x", w)
      .attr("y", function (d) {
        return yScale(d["label"]);
      })
      .attr("width", function (d) {
        return xScale(parseInt(d[displayDate[index]]) + 50);
      })
      .attr("height", yScale.bandwidth())
      .attr("fill", "#CD5C5C")
      .merge(bars)
      .transition() // Add animation when adding new bars
      .duration(1000)
      .attr("x", xScale(0))
      .attr("y", function (d) {
        return yScale(d["label"]);
      })
      .attr("width", function (d) {
        return xScale(parseInt(d[displayDate[index]]));
      })
      .attr("height", yScale.bandwidth())
      .attr("fill", "steelblue");

    svg.select(".x.axis").transition().duration(1000).call(xAxis);
    svg.select(".y.axis").transition().duration(1000).call(yAxis);

    bars.exit().transition().duration(1000).attr("x", w).remove();
  });
}
