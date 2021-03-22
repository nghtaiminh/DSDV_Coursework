const w = 500;
const h = 500;
const barPadding = 1;
var dataset = [
  5,
  30,
  45,
  60,
  50,
  60,
  47,
  85,
  29,
  9,
  30,
  21,
  32,
  84,
  55,
  12,
  70,
  58,
  95,
  20,
];

var svg1 = d3.select("#svg1");
svg1.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", function (d, i) {
    return i * (w / dataset.length);
  })
  .attr("y", function (d) {
    return h - d * 4;
  })
  .attr("width", w / dataset.length - barPadding)
  .attr("height", function (d) {
    return d * 4;
  })
  .attr("fill", function (d) {
    return "rgb(0, 0, " + Math.round(d * 10) + ")";
  });

svg1.selectAll("text")
  .data(dataset)
  .enter()
  .append("text")
  .text(function (d) {
    return d;
  })
  .attr("x", function (d, i) {
    return i * (w / dataset.length) + w / dataset.length / 2;
  })
  .attr("y", function (d) {
    return h - d * 4 + 14;
  })
  .attr("font-family", "san-serif")
  .attr("font-sixe", "11px")
  .attr("fill", "white")
  .attr("text-anchor", "middle");
