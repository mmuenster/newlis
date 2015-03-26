'use strict';

describe('Controller: AddnewuserCtrl', function () {

  // load the controller's module
  beforeEach(module('newlisApp'));

  var AddnewuserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddnewuserCtrl = $controller('AddnewuserCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
