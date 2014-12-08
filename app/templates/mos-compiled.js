(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['mos-charts.html'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"container\">\n    <!--Each section can a d3 element-->\n    <section class=\"view\">\n      <svg id=\"barchart\"></svg>\n    </section>\n\n    <section id=\"scatter-chart\" class=\"view\">\n    </section>\n\n    <section class=\"view\">\n      <select id=\"bubble-chart-selector\">\n          <option value=\"eui\">EUI</option>\n          <option value=\"energystar\">Energy Star Score</option>\n          <option value=\"emissions\">Building Emissions</option>\n      </select>\n      <svg id=\"bubble-chart\"></svg>\n    </section>\n\n    <section id=\"time-scatter-chart\" class=\"view\">\n    </section>\n</div>\n\n";
  },"useData":true});
templates['mos-info.html'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"container\">\n    <div class=\"row\">\n        <h3>Info!</h3>\n    </div>\n</div>";
  },"useData":true});
templates['mos-map.html'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"map\"></div>";
  },"useData":true});
})();