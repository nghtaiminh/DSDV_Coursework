d3.queue()
  .defer(
    d3.json,
    "https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json"
  )
  .defer(
    d3.csv,
    "https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces-data.csv"
  )
  .defer(d3.csv, "Covid19_VN.csv")
  .await(function (error, geojson, provinceData, covidData) {
    if (error) throw error;

    const width = 1200;
    const height = 600;

    var path = d3
      .geoPath()
      .projection(d3.geoMercator().fitSize([width, height], geojson));

    // Choropleth map of Vietnam for population by province
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var colorScale = d3
      .scaleQuantize()
      .range(d3.schemeGreens[7])
      .domain([
        d3.min(provinceData, (d) => parseFloat(d["population"])),
        d3.max(provinceData, (d) => parseFloat(d["population"])),
      ]);

    // Merge the population of the province to corresponding  province in json file
    for (var i = 0; i < provinceData.length; i++) {
      var provinceID = provinceData[i]["ma"];
      if (provinceID.length == 1) {
        provinceID = "0" + provinceID;
      }

      var population = parseFloat(provinceData[i]["population"]);

      for (var j = 0; j < geojson.features.length; j++) {
        var jsonProvinceID = geojson.features[j].properties["Ma"];

        if (provinceID == jsonProvinceID) {
          geojson.features[j].properties["population"] = population;
          break;
        }
      }
    }
    svg.selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        var value = d.properties["population"];
        if (value) {
          return colorScale(value);
        } else {
          return "#ccc";
        }
      })
      .append("title")
      .text(function (d) {
        return (
          "Tỉnh/Thành phố: " +
          d.properties["Ten"] +
          "\nDân số: " +
          d.properties["population"]
        );
      });

    //================================================================

    // Choropleth map of Vietnam for COVID confirmed cases by provinces
    var svg2 = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var colorScale2 = d3
      .scaleQuantize()
      .range(d3.schemeReds[7])
      .domain([
        d3.min(covidData, (d) => d["ConfirmedCase"]),
        d3.max(covidData, (d) => d["ConfirmedCase"]),
      ]);

    //
    for (var idx = 0; idx < geojson.features.length; idx++) {
      geojson.features[idx].properties["ConfirmedCase"] = 0;
    }

    for (var i = 0; i < covidData.length; i++) {
      var regionName = covidData[i]["Region/City"];
      // console.log("Region: ", regionName)

      var confirmedCase = parseFloat(covidData[i]["ConfirmedCase"]);
      // console.log("Confirmed Case: ", confirmedCase)

      for (var j = 0; j < geojson.features.length; j++) {
        var jsonRegionName = geojson.features[j].properties["Ten"];
        // console.log("jsonRegion:", jsonRegionName);
        if (jsonRegionName.includes(regionName)) {
          geojson.features[j].properties[
            "ConfirmedCase"
          ] = confirmedCase;
          break;
        }
      }
    }
    for (var j = 0; j < geojson.features.length; j++) {
      console.log(geojson.features[j].properties["ConfirmedCase"]);
    }

    svg2.selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        var value = d.properties["ConfirmedCase"];
        if (value) {
          return colorScale2(value);
        } else {
          return "#ccc";
        }
      })
      .append("title")
      .text(function (d) {
        return (
          "Tỉnh/Thành phố: " +
          d.properties["Ten"] +
          "\nSố ca nhiễm: " +
          d.properties["ConfirmedCase"]
        );
      });
  });
