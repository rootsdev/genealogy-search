'use strict';

/* jasmine specs for controllers go here */

describe('GeneToolsApp controllers', function() {

  describe('GeneToolsController', function() {
    var scope, ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller(GeneToolsController, {$scope: scope});
      
      scope.firstName = 'Some';
      scope.lastName = 'Person';
      scope.birthYear = 1914;
      scope.birthPlace = 'Abernathy, Main';
      scope.deathYear = 1990;
      scope.deathPlace = 'Main, Abernathy';
      scope.keywords = 'Keyword1 Keyword2';
    }));


    it('should build the Family Search URL', function() {
      expect(buildFamilySearchUrl(scope)).toEqual(
          'https://www.familysearch.org/search/records/index' +
          '#count=50&query=' +
          '%2Bgivenname%3A%22Some%22~%20%2Bsurname%3A%22Person%22~%20' +
          '%2Bbirth_place%3A%22Abernathy%2C%20Main%22~%20%2Bbirth_year%3A1914~%20' +
          '%2Bdeath_place%3A%22Main%2C%20Abernathy%22~%20%2Bdeath_year%3A1990~%20');
    });


    it('should build the We Relate URL', function() {
      expect(buildWeRelateUrl(scope)).toEqual(
          'http://www.werelate.org/wiki/Special:Search?ns=Person' +
          '&g=Some&s=Person' +
          '&bd=1914&br=0&bp=Abernathy%2C%20Main' +
          '&dd=1990&dr=0&dp=Main%2C%20Abernathy' +
          '&k=Keyword1%20Keyword2' +
          '&rows=20&ecp=p');
    });


    it('should build the My Heritage URL', function() {
      expect(buildMyHeritageUrl(scope)).toEqual(
          'http://www.myheritage.com/FP/API/Search/' +
          'get-search-results.php?partner=google' +
          '&last=Person&first=Some&birth_year=1914&death_year=1990');
    });


    it('should build the Geni URL', function() {
      expect(buildGeniUrl(scope)).toEqual(
          'http://www.geni.com/search?search_type=people&names=Some%20Person');
    });


    it('should build the Google People Search URL', function() {
      expect(buildPeopleSearchUrl(scope)).toEqual(
          'https://www.google.com/search' +
          '?q=Some%20Person+1914..1990+Keyword1%20Keyword2+~genealogy');
    });


    it('should build the Google Image Search URL', function() {
      expect(buildImageSearchUrl(scope)).toEqual(
          'https://www.google.com/search' +
          '?tbm=isch&q=Some%20Person+1914..1990+Keyword1%20Keyword2+~genealogy');
    });


    it('should build the Google Book Search URL', function() {
      expect(buildBookSearchUrl(scope)).toEqual(
          'https://www.google.com/search' +
          '?tbm=bks&q=Some%20Person+1914..1990+Keyword1%20Keyword2');
    });


    it('should build the Google News Search URL', function() {
      expect(buildNewsSearchUrl(scope)).toEqual(
          'https://www.google.com/search' +
          '?tbm=nws&tbs=ar:1&q=Some%20Person+Keyword1%20Keyword2');
    });


    it('should build the Google Maps Search URL with birth and death', function() {
      expect(buildMapsUrl(scope)).toEqual(
          'https://maps.google.com/maps?saddr=Abernathy%2C%20Main' +
          '&daddr=Main%2C%20Abernathy');
    });


    it('should build the Google Maps Search URL with birth only', function() {
      scope.deathYear = null;
      scope.deathPlace = null;
      
      expect(buildMapsUrl(scope)).toEqual(
          'https://maps.google.com/maps?q=Abernathy%2C%20Main');
    });


    it('should build the Google Maps Search URL with death only', function() {
      scope.birthYear = null;
      scope.birthPlace = null;

      expect(buildMapsUrl(scope)).toEqual(
          'https://maps.google.com/maps?q=Main%2C%20Abernathy');
    });
  });
});
