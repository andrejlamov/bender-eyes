import "regenerator-runtime/runtime";
import * as d3 from "d3";
//import bender_eyes from "./bender-eyes.svg";
const bender_eyes = "bender-eyes.svg"

// Thanks Mike https://bl.ocks.org/mbostock/8027637
function closestPoint(pathNode, point) {
  var pathLength = pathNode.getTotalLength(),
      precision = 8,
      best,
      bestLength,
      bestDistance = Infinity;

  // linear scan for coarse approximation
  for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
    if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
      best = scan, bestLength = scanLength, bestDistance = scanDistance;
    }
  }

  // binary search for precise estimate
  precision /= 2;
  while (precision > 0.5) {
    var before,
        after,
        beforeLength,
        afterLength,
        beforeDistance,
        afterDistance;
    if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
      best = before, bestLength = beforeLength, bestDistance = beforeDistance;
    } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
      best = after, bestLength = afterLength, bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
  }

  best = [best.x, best.y];
  best.distance = Math.sqrt(bestDistance);
  return best;

  function distance2(p) {
    var dx = p.x - point[0],
        dy = p.y - point[1];
    return dx * dx + dy * dy;
  }
}

var is_dark = false;

async function main() {
  const bender = await d3.svg(bender_eyes);
  const root = d3.select("#root");
  root.append("button").text("Dark mode toggle").on("click", () => {
    is_dark = !is_dark;
    render(svg);
  });

  root.node().appendChild(bender.documentElement);

  const svg = root.select("svg");

   svg.attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", null);

  render(svg)
}

function render(svg) {

  var left_move_path, left_eye, right_move_path, right_eye = null;
  if (is_dark) {
    d3.select("#layer16").style("display", null)
    d3.select("#layer10").style("display", "none")
    d3.select("body div").style("background-color", "black")

    left_move_path = svg.select("#layer22 path");
    left_eye = d3.select("#layer25 rect");

    right_move_path = svg.select("#layer21 path");
    right_eye = d3.select("#layer19 rect");
  } else {
    d3.select("body div").style("background-color", "white")
    d3.select("#layer16").style("display", "none")
    d3.select("#layer10").style("display", null)

    left_move_path = svg.select("#layer6 path");
    left_eye = d3.select("#layer3 rect");

    right_move_path = svg.select("#layer7 path");
    right_eye = d3.select("#layer4 rect");
  }
  d3.select(document)
    .on("mousemove", (e) => {
      const {clientX, clientY} = e;
      const [lx, ly] = closestPoint(left_move_path.node(), [clientX, clientY]);
      const [rx, ry] = closestPoint(right_move_path.node(), [clientX, clientY]);

      left_eye
        .attr("x", lx)
        .attr("y", ly);

      right_eye
        .attr("x", rx)
        .attr("y", ry)

    });
}

main();
