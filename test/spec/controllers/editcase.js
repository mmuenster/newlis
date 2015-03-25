'use strict';

describe('Controller: EditcaseCtrl', function () {

  // load the controller's module
  beforeEach(module('newlisApp'));

  var EditcaseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditcaseCtrl = $controller('EditcaseCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
