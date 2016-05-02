///**
// * Created by haffo on 2/2/15.
// */

angular.module('tool').run(function ($httpBackend, $q, $http) {

    $httpBackend.whenGET('api/session/keepAlive').respond(function (method, url, data, headers) {
        return [200, {}, {}];
    });


    $httpBackend.whenGET('api/shortaccounts?filter=accountType::author').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET', '../../resources/shortaccounts.json', false);
        request.send(null);
        var profile = request.response;
        return [request.status, profile, {}];
    });

    $httpBackend.whenPOST('api/accounts/1/userpasswordchange').respond(function (method, url, data, headers) {
        return [200, {type: 'success',
            text: 'accountPasswordReset',
            resourceId: '1',
            manualHandle: "false"}, {}];
    });

    $httpBackend.whenPOST('api/accounts/2/userpasswordchange').respond(function (method, url, data, headers) {
        return [200, {type: 'success',
            text: 'invalidPassword',
            resourceId: '2',
            manualHandle: "false"}, {}];
    });

    $httpBackend.whenPOST('api/accounts/1/approveaccount').respond(function (method, url, data, headers) {
        return [200, {type: 'success',
            text: 'accountApproved',
            resourceId: '1',
            manualHandle: "false"}, {}];
    });

    $httpBackend.whenPOST('api/accounts/2/approveaccount').respond(function (method, url, data, headers) {
        return [200, {type: 'success',
            text: 'accountIsNotPending',
            resourceId: '2',
            manualHandle: "false"}, {}];
    });


    $httpBackend.whenPOST('api/accounts/1/suspendaccount').respond(function (method, url, data, headers) {
        return [200, {type: 'success',
            text: 'accountSuspended',
            resourceId: '1',
            manualHandle: "false"}, {}];
    });


    $httpBackend.whenGET('api/accounts/cuser').respond(function (method, url, data, headers) {
        return [200, {}, {}];
    });

    $httpBackend.whenGET('api/accounts/login').respond(function (method, url, data, headers) {
        return [200, {}, {}];
    });

    $httpBackend.whenGET(/views\//).passThrough();
    $httpBackend.whenGET(/lib\//).passThrough();
    $httpBackend.whenGET(/resources\//).passThrough();

    $httpBackend.whenGET('api/appInfo').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET', '../../resources/appInfo.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });

    $httpBackend.whenGET('api/cb/testcases').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cb/testPlans.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });
    $httpBackend.whenGET('api/cf/testcases').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cf/testCases.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });
    $httpBackend.whenGET('api/connectivity/testcases').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/connectivity/testCases.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });
    $httpBackend.whenPOST('api/connectivity/validate').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/soap/result.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });
    $httpBackend.whenPOST('api/connectivity/send').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cb/send.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });

    $httpBackend.whenGET('api/envelope/testcases').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/envelope/testCases.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });

    $httpBackend.whenPOST('api/envelope/testcases/1/validate').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/soap/result.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });

    $httpBackend.whenPOST('api/hl7v2/testcontext/1/validateMessage').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cf/newValidationResult3.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });

    $httpBackend.whenPOST('api/hl7v2/testcontext/1/parseMessage').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cf/messageObject.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });


    $httpBackend.whenPOST('api/accounts/createGuest').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cb/user.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });

    $httpBackend.whenPOST('api/session/create').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cb/session.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });

    $httpBackend.whenGET('api/transport/config/forms').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cb/transport-forms.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });

    $httpBackend.whenPOST('api/transport/iz/soap/configs').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cb/transport-config-data.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });

    $httpBackend.whenPOST('api/transport/iz/soap/searchTransaction').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cb/transaction.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });


    $httpBackend.whenPOST('api/transport/iz/soap/startListener').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cb/startListener.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });

    $httpBackend.whenPOST('api/transport/iz/soap/stopListener').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cb/stopListener.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });

    $httpBackend.whenPOST('api/transport/iz/soap/send').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cb/send.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });

    $httpBackend.whenPOST('api/transport/iz/soap/populateMessage').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cb/populateMessage.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });


    $httpBackend.whenPOST('api/transport/config/save').respond(function (method, url, data, headers) {
        var request = new XMLHttpRequest();
        request.open('GET','../../resources/cb/saveConfig.json', false);
        request.send(null);
        var d = angular.fromJson(request.response);
        return [request.status, d, {}];
    });







});

