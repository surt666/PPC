function translatepgt(pgt) {
  if (pgt == "0") {
    return "Abonnement";
  } else if (pgt == "1") {
    return "Krævet ydelse";
  } else if (pgt == "2") {
    return "Tillægsabonnement";
  } else if (pgt == "3") {
    return "Engangs ydelse";
  }
}

function insertproducts(prods) {
  var s = "";
  for (i=0;i<prods.length;i++) {
    s = s + "<tr><td>" + prods[i].varenr + "</td><td>" + prods[i].navn + "</td><td>" + translatepgt(prods[i].pgt) + "</td><td>" + "<td></td><td></td><td></td>";
  }
  $("#produkter").html(s);
}

function getproducts() {
  $.ajax({
    type: "GET",
    cache: false,
    url: "/ppc/produkter",
    dataType: "json",            
    error: function(request, error) {
      alert(error);
    },
    success: function(result) {
      insertproducts(result)
    }
  });
}

