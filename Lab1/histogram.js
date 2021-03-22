var createHistogram = function (name) {
  const barWidth = 50;
  var dataset = countLetter(name);
  var svg = document.getElementsByTagName("svg")[0];
  addEltToSVG(svg, "svg", {
    height: 500,
    width: 450,
    viewBox: "0 0 450 500",
    style: "display:block; background-color: white; ",
  });
  for (var idx = 0; idx < dataset.length; idx++) {
    if (dataset[idx] === 0) {
      addEltToSVG(svg, "rect", {
        x: idx * 50,
        y: 50,
        width: barWidth,
        height: 1,
        style: "fill:blue; strole:black; stroke-width:2",
      });
    }
    if (dataset[idx] != 0) {
      addEltToSVG(svg, "rect", {
        x: idx * 50,
        y: 50,
        width: barWidth,
        height: dataset[idx] * 50,
        style: "fill:blue; strole:black; stroke-width:2",
      });
    }
  }
};
/**
 *  This function input a string and return an array counting the number of each bin
 * @param {*} nameInput
 */
function countLetter(nameInput) {
  var bin = [/[A-D]/g, /[E-H]/g, /[I-L]/g, /[M-P]/g, /[Q-U]/g, /[V-Z]/g];
  var countArr = [0, 0, 0, 0, 0, 0];
  if (typeof nameInput == "string") {
    var name = nameInput.toUpperCase();
    var nameLength = name.length;
  }
  for (var nameIdx = 0; nameIdx < nameLength; nameIdx++) {
    for (var binIdx = 0; bin.length; binIdx++) {
      if (name.charAt(nameIdx).match(bin[binIdx]) != null) {
        countArr[binIdx] += 1;
        break;
      }
      console.log(countArr);
    }
  }
  return countArr;
}

/**
 *
 * @param {*} svg
 * @param {*} name
 * @param {*} attrs
 */
function addEltToSVG(svg, name, attrs) {
  var element = document.createElementNS("http://www.w3.org/2000/svg", name);
  if (attrs === undefined) attrs = {};
  for (var key in attrs) {
    element.setAttributeNS(null, key, attrs[key]);
  }
  svg.appendChild(element);
}

window.onload = createHistogram("Minh");
