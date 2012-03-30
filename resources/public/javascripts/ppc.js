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
  window.open('/detaljer.html?varenr=' + varenr,'details','menubar=yes,width=400,height=200');
}

function opretnypris() {
  window.open('/nypris.html?kontrakt=' + $('#planer').val(),'details','menubar=yes,width=400,height=200');
}

function opretnyservice() {
  window.open('/nyservice.html?type=' + $('#servicetype').val(),'details','menubar=yes,width=400,height=200');
}

function insertproducts(prods) {
  var s = "";
  for (i=0;i<prods.length;i++) {
    s = s + "<tr><td><input type=\"checkbox\" /></td><td>" + prods[i].varenr + "</td><td>" + prods[i].navn + "</td><td>" + translatepgt(prods[i].pgt) + "</td><td>" + "<td><a href=\"#\" id=\"detaljer\" class=\"nice small blue button\" onclick=\"javascript:showdetails(" + prods[i].varenr + ");\">Detaljer</a></td><td><a href=\"#\" id=\"slet\" class=\"nice small blue button\" onclick=\"javascript:slet(" + prods[i].varenr + ");\">Slet</a></td></td><td><a href=\"#\" id=\"sync\" class=\"nice small blue button\" onclick=\"javascript:sync(" + prods[i].varenr + ");\">Sync</a></td></td></tr>";
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

function sync(varenr) {
  $.ajax({
      type: "PUT",
      accepts: "application/json",
      cache: false,
      url: "/ppc/sync/" + varenr,
      dataType: "json",
      error: function(request, error) {
          alert(error + " " + JSON.stringify(request));
      },
      success: function(result) {
          alert("Synced");
      }
  });
}

function insertplaner(planer) {
  var s = "";
  for (i=0;i<planer.length;i++) {
    s = s + "<option value=" + planer[i] + ">" + planer[i] + "</option>";
  }
  $("#planer").html(s);
}

function hentplaner() {
   $.ajax({
    type: "GET",
    cache: false,
    url: "/ppc/prisplan/alle",
    dataType: "json",            
    error: function(request, error) {
      alert(error);
    },
    success: function(result) {
      insertplaner(result)
    }
  });
}

function insertpriser(priser) {
  var p = "";
  for (i=0;i<priser.length;i++) {
    p = p + "<tr><td>" + priser[i].varenr + "</td><td>" + priser[i].pris + "</td><td>" + priser[i].copydan + "</td><td>" + priser[i].koda + "</td><td>" + priser[i]['radio-koda'] + "</td><td>" + priser[i].moms + "</td><td>" + priser[i].totalpris + "</td><td><a href=\"#\" id=\"sletpris\" class=\"nice small blue button\">Slet</a></td></tr>";
  }  
  $("#priser").html(p);
}

function showplan(kontrakt) {
  $.ajax({
    type: "GET",
    cache: false,
    url: "/ppc/prisplan/" + kontrakt,
    dataType: "json",            
    error: function(request, error) {
      alert(error);
    },
    success: function(result) {
      insertpriser(result);
    }
  });
}

function opretpris(pris) {
  alert(JSON.stringify(pris));
  $.ajax({
      type: "POST",
      accepts: "application/json",
      cache: false,
      contentType: "application/json",
      url: "/ppc/prisplan",
      dataType: "json",
      data: JSON.stringify(pris),
      error: function(request, error) {
          alert(error + " " + JSON.stringify(request));
      },
      success: function(result) {
          self.close();
      }
  });
}

function insertservices(services) {
  var p = "";
  for (i=0;i<services.length;i++) {
    p = p + "<tr><td>" + services[i].id + "</td><td>" + services[i].provisioneringskode + "</td><td>" + services[i].logistikkode + "</td></tr>";
  }  
  $("#services").html(p);
}

function showservices(type) {
  $.ajax({
    type: "GET",
    cache: false,
    url: "/ppc/services/" + type,
    dataType: "json",            
    error: function(request, error) {
      alert(error);
    },
    success: function(result) {
      insertservices(result);
    }
  });
}

function opretservice(service) {
  alert(JSON.stringify(service));
  $.ajax({
      type: "POST",
      accepts: "application/json",
      cache: false,
      contentType: "application/json",
      url: "/ppc/services",
      dataType: "json",
      data: JSON.stringify(service),
      error: function(request, error) {
          alert(error + " " + JSON.stringify(request));
      },
      success: function(result) {
          self.close();
      }
  });
}

