function onError(e) {
  console.log(e);
}

// FILESYSTEM SUPPORT ----------------------------------------------------------
var fs = null;
var FOLDERNAME = 'test';

function writeFile(blob) {
  if (!fs) {
    return;
  }

  fs.root.getDirectory(FOLDERNAME, {create: true}, function(dirEntry) {
    dirEntry.getFile(blob.name, {create: true, exclusive: false}, function(fileEntry) {
      // Create a FileWriter object for our FileEntry, and write out blob.
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.onerror = onError;
        fileWriter.onwriteend = function(e) {
          console.log('Write completed.');
        };
        fileWriter.write(blob);
      }, onError);
    }, onError);
  }, onError);
}
// -----------------------------------------------------------------------------

var geneToolsApp = angular.module('geneToolsApp', []);

geneToolsApp.factory('gdocs', function() {
  var gdocs = new GDocs();

  var dnd = new DnDFileController('body', function(files) {
    var $scope = angular.element(this).scope();
    Util.toArray(files).forEach(function(file, i) {
      gdocs.upload(file, function() {
        $scope.fetchDocs(true);
      }, true);
    });
  });

  return gdocs;
});
//geneToolsApp.service('gdocs', GDocs);
//geneToolsApp.controller('GeneToolsController', ['$scope', '$http', GeneToolsController]);

// Main Angular controller for app.
function GeneToolsController($scope, $http, gdocs) {
  // Search on Family Search
  $scope.fsSearch = function() {
    openSearchWindow(buildFamilySearchUrl($scope));
  };

  // Search on We Relate
  $scope.wrSearch = function() {
    openSearchWindow(buildWeRelateUrl($scope));
  };

  // Search on My Heritage
  $scope.mhSearch = function() {
    openSearchWindow(buildMyHeritageUrl($scope));
  };

  // Search on Geni
  $scope.geSearch = function() {
    openSearchWindow(buildGeniUrl($scope));
  };

  // Search on Google
  $scope.glSearch = function() {
    openSearchWindow(buildPeopleSearchUrl($scope));
    openSearchWindow(buildImageSearchUrl($scope));
    openSearchWindow(buildBookSearchUrl($scope));
    openSearchWindow(buildNewsSearchUrl($scope));
    if ($scope.birthPlace || $scope.deathPlace) {
      openSearchWindow(buildMapsUrl($scope));      
    }
  };
}

GeneToolsController.$inject = ['$scope', '$http']; // For code minifiers.

function openSearchWindow(url) {
  window.open(url, "_blank");
}


/**
 * Builds a query URL to send to Family Search for a person.
 * @param {!Scope} $scope The Angular scope.
 * @return {string} The resulting query URL.
 */
function buildFamilySearchUrl($scope) {
  var query = '';
  if ($scope.firstName) {
    query += '+givenname:"' + $scope.firstName + '"~ ';
  }
  if ($scope.lastName) {
    query += '+surname:"' + $scope.lastName + '"~ ';
  }
  if ($scope.birthPlace) {
    query += '+birth_place:"' + $scope.birthPlace + '"~ ';
  }
  if ($scope.birthYear) {
    query += '+birth_year:' + $scope.birthYear + '~ ';
  }
  if ($scope.deathPlace) {
    query += '+death_place:"' + $scope.deathPlace + '"~ ';
  }
  if ($scope.deathYear) {
    query += '+death_year:' + $scope.deathYear + '~ ';
  }
  var url = 'https://www.familysearch.org/search/records/index' +
    '#count=50&query=' + encodeURIComponent(query);
  return url;
}


/**
 * Builds a query URL to send to WeRelate.org for a person.
 * @param {!Scope} $scope The Angular scope.
 * @return {string} The resulting query URL.
 */
function buildWeRelateUrl($scope) {
  var query = '';
  if ($scope.firstName) {
    query += '&g=' + encodeURIComponent($scope.firstName);
  }
  if ($scope.lastName) {
    query += '&s=' + encodeURIComponent($scope.lastName);
  }
  if ($scope.birthYear) {
    query += '&bd=' + encodeURIComponent($scope.birthYear) + '&br=0';
  }
  if ($scope.birthPlace) {
    query += '&bp=' + encodeURIComponent($scope.birthPlace);
  }
  if ($scope.deathYear) {
    query += '&dd=' + encodeURIComponent($scope.deathYear) + '&dr=0';
  }
  if ($scope.deathPlace) {
    query += '&dp=' + encodeURIComponent($scope.deathPlace);
  }
  if ($scope.keywords) {
    query += '&k=' + encodeURIComponent($scope.keywords);
  }
  var search = 'http://www.werelate.org/wiki/Special:Search?ns=Person'
      + query + '&rows=20&ecp=p';
  return search;
}


/**
 * Builds a query URL to send to MyHeritage to search for a person.
 * @param {!Scope} $scope The Angular scope.
 * @return {string} The resulting query URL.
 */
function buildMyHeritageUrl($scope) {
  var url = 'http://www.myheritage.com/FP/API/Search/get-search-results.php' +
      '?partner=google';

  // Last name is required.
  url += '&last=' + encodeURIComponent($scope.lastName);
  if ($scope.firstName) {
    url += '&first=' + encodeURIComponent($scope.firstName);    
  }
  if ($scope.birthYear) {
    url += '&birth_year=' + encodeURIComponent($scope.birthYear);
  }
  if ($scope.deathYear) {
    url += '&death_year=' + encodeURIComponent($scope.deathYear);
  }
  return url;
}


/**
 * Builds a query URL to send to Geni to search for a person.
 * @param {!Scope} $scope The Angular scope.
 * @return {string} The resulting query URL.
 */
function buildGeniUrl($scope) {
  return 'http://www.geni.com/search?search_type=people&names=' +
      encodeURI($scope.firstName + ' ' + $scope.lastName);
}


/**
 * Builds a query URL to send to Google Search for a person.
 * @param {!Scope} $scope The Angular scope.
 * @return {string} The resulting query URL.
 */
function buildPeopleSearchUrl($scope) {
  return 'https://www.google.com/search?q=' +
      buildGoogleQuery($scope) + '+~genealogy';
}


/**
 * Builds a query URL to send to Google Image Search for a person.
 * @param {!Scope} $scope The Angular scope.
 * @return {string} The resulting query URL.
 */
function buildImageSearchUrl($scope) {
  return 'https://www.google.com/search?tbm=isch&q=' +
      buildGoogleQuery($scope) + '+~genealogy';
}


/**
 * Builds a query URL to send to Google Book Search for a person.
 * @param {!Scope} $scope The Angular scope.
 * @return {string} The resulting query URL.
 */
function buildBookSearchUrl($scope) {
  return 'https://www.google.com/search?tbm=bks&q=' +
      buildGoogleQuery($scope);
}


/**
 * Builds a query URL to send to Google News Search for a person.
 * @param {!Scope} $scope The Angular scope.
 * @return {string} The resulting query URL.
 */
function buildNewsSearchUrl($scope) {
  return 'https://www.google.com/search?tbm=nws&tbs=ar:1&q=' +
      buildGoogleQuery($scope, true);
}


/**
 * Builds a query URL to send to Google Maps for a place. If two places
 * exist, it will show directions between the two places. Otherwise,
 * it will just bring up a map of the one place.
 * @param {!Scope} $scope The Angular scope.
 * @return {string} The resulting query URL.
 */
function buildMapsUrl($scope) {
  var url = 'https://maps.google.com/maps';
  if ($scope.birthPlace && $scope.deathPlace) {
    url += '?saddr=' + encodeURIComponent($scope.birthPlace);
    url += '&daddr=' + encodeURIComponent($scope.deathPlace);
  } else if ($scope.birthPlace) {
    url += '?q=' + encodeURIComponent($scope.birthPlace);
  } else if ($scope.deathPlace) {
    url += '?q=' + encodeURIComponent($scope.deathPlace);
  }
  return url;
}


/**
 * Builds the query string for a Google query.
 * @param {!Scope} $scope The Angular scope.
 * @param {boolean=} opt_excludeDate Whether to exclude dates in the query.
 * @return {string} The resulting query string.
 */
function buildGoogleQuery($scope, opt_excludeDate) {
  var opt_excludeDate = opt_excludeDate || false;
  var q = encodeURIComponent($scope.firstName + ' ' + $scope.lastName);
  if (!opt_excludeDate && ($scope.birthYear || $scope.deathYear)) {
    q += '+';
    if ($scope.birthYear) {
      q += $scope.birthYear;
    }
    if ($scope.birthYear && $scope.deathYear) {
      q += '..';
    }
    if ($scope.deathYear) {
      q += $scope.deathYear;
    }
  }
  if ($scope.keywords) {
    q += '+' + encodeURIComponent($scope.keywords);
  }
  return q;
}


// Init setup and attach event listeners.
document.addEventListener('DOMContentLoaded', function(e) {
  var closeButton = document.querySelector('#close-button');
  closeButton.addEventListener('click', function(e) {
    window.close();
  });

  // FILESYSTEM SUPPORT --------------------------------------------------------
  window.webkitRequestFileSystem(TEMPORARY, 1024 * 1024, function(localFs) {
    fs = localFs;
  }, onError);
  // ---------------------------------------------------------------------------
});
