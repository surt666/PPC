<<<<<<< HEAD

=======
>>>>>>> f5e8a2bed0d5116a241d69ce7da4587210997a33
var products;

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

function getURLParam(strParamName) {
  var strReturn = "";
  var strHref = window.location.href;
  if ( strHref.indexOf("?") > -1 ){
    var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
    var aQueryString = strQueryString.split("&");
    for ( var iParam = 0; iParam < aQueryString.length; iParam++ ){
      if (aQueryString[iParam].indexOf(strParamName.toLowerCase() + "=") > -1 ) {
        var aParam = aQueryString[iParam].split("=");
        strReturn = aParam[1];
        break;
      }
    }
  }
  return unescape(strReturn);
}

function showdetails(varenr) {
  window.open('/detaljer.html?varenr=' + varenr,'details','width=400,height=200');
}

<<<<<<< HEAD

=======
>>>>>>> f5e8a2bed0d5116a241d69ce7da4587210997a33
function insertproducts(prods) {
  var s = "";
  for (i=0;i<prods.length;i++) {
    s = s + "<tr><td>" + prods[i].varenr + "</td><td>" + prods[i].navn + "</td><td>" + translatepgt(prods[i].pgt) + "</td><td>" + "<td><a href=\"#\" id=\"detaljer\" class=\"nice blue button\" onclick=\"javascript:showdetails(" + prods[i].varenr + ");\">Detaljer</a></td><td><a href=\"#\" id=\"sync\" class=\"nice blue button\">Sync</a></td>";
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
      products = result;
      insertproducts(result)
    }
  });
}

function getproduct(varenr) {
  var ret;
  $.ajax({
    type: "GET",
    cache: false,
    url: "/ppc/produkter/" + varenr,
    dataType: "json", 
    async: false,           
    error: function(request, error) {
      alert(error);
    },
    success: function(result) {     
      ret = result;
    }
  });
  return ret;
}

<<<<<<< HEAD
=======
function opdater(p) {
  $.ajax({
      type: "POST",
      accepts: "application/json",
      cache: false,
      contentType: "application/json",
      url: "/ppc/produkter",
      dataType: "json",
      data: JSON.stringify(p),
      error: function(request, error) {
          alert(error + " " + JSON.stringify(request));
      },
      success: function(result) {
          self.close();
      }
  });
}

>>>>>>> f5e8a2bed0d5116a241d69ce7da4587210997a33
