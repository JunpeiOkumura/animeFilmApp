var map;
var sparql = ""

$(document).ready(function() {
  initMap();
  $("select").change(function () {
    if (this.value !== "変化前") {
      sparql = "PREFIX bp: <http://data.lodanime.jp/property/> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX cc: <http://creativecommons.org/ns#> PREFIX dc: <http://purl.org/dc/elements/1.1/> SELECT DISTINCT ?pref1 ?label WHERE { ?subject rdfs:label ?label; bp:都道府県 ?pref1.}";
      d3sparql.query("http://localhost:3030/animeFilm/query", sparql, render);
    }
  });
});

// Mapへのマーカー描画
function render(json) {
  // initMap();
  var dict = {};
  $.each(json["results"]["bindings"], function(key, value) {
    dict[value["pref1"]["value"]] = value["label"]["value"]
  });
  $.each(latlnglist["marker"], function(key, value) {
    var pref = value["pref"]
    var lat = value["lat"]
    var lng = value["lng"]
    var marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup("<span>" + pref + ": " + dict[pref] + "</span>").openPopup();
  });
}

// Mapの初期化
function initMap() {
  map = L.map('gmap').setView([35.619, 139.751], 8);

  // 地理院地図レイヤー追加
  L.tileLayer(
    // 地理院地図利用
    'http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
    {
      attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
    }
  ).addTo(map);
}
