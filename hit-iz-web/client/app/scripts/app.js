'use strict';

angular.module('commonServices', []);
angular.module('common', ['ngResource', 'my.resource', 'default', 'xml', 'hl7v2-edi', 'hl7v2', 'edi', 'soap']);
angular.module('cf', ['common']);
angular.module('doc', ['common']);
angular.module('cb', ['common']);
angular.module('envelope', ['soap']);
angular.module('connectivity', ['soap']);
angular.module('isolated', ['common']);
angular.module('hit-tool-directives', []);
angular.module('hit-tool-services', ['common']);
angular.module('account', ['common']);
angular.module('documentation', []);
var app = angular.module('tool', [
    'ngRoute',
    'ui.bootstrap',
    'ngCookies',
    'LocalStorageModule',
    'ngResource',
    'ngSanitize',
    'ngIdle',
    'ngAnimate',
    'ui.bootstrap',
    'angularBootstrapNavTree',
    'QuickList',
    'format',
    'soap',
    'default',
    'hl7v2-edi',
    'xml',
    'hl7v2',
    'edi',
    'soap',
    'envelope',
    'connectivity',
    'cf',
    'cb',
    'isolated',
    'ngTreetable',
    'blueimp.fileupload',
    'hit-tool-directives',
    'hit-tool-services',
    'commonServices',
    'smart-table',
    'doc',
    'hit-vocab-search',
    'hit-profile-viewer',
    'hit-validation-result',
    'hit-report-viewer',
    'hit-testcase-details',
    'hit-testcase-tree',
    'hit-doc',
    'hit-dqa',
    'hit-settings',
    'documentation',
    'hit-manual-report-viewer',
    'account',
    'ngNotificationsBar',
    'ngMockE2E'
]);

var httpHeaders;

app.config(function ($routeProvider, $httpProvider, localStorageServiceProvider, KeepaliveProvider, IdleProvider) {

    localStorageServiceProvider
        .setPrefix('hit-tool')
        .setStorageType('sessionStorage');

    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html'
        })
        .when('/home', {
            templateUrl: 'views/home.html'
        })
        .when('/doc', {
            templateUrl: 'views/doc.html'
        })
        .when('/setting', {
            templateUrl: 'views/setting.html'
        })
        .when('/about', {
            templateUrl: 'views/about.html'
        })
        .when('/contact', {
            templateUrl: 'views/contact.html'
        })
        .when('/soapEnv', {
            templateUrl: 'views/envelope/envelope.html'
        })
        .when('/soapConn', {
            templateUrl: 'views/connectivity/connectivity.html'
        })
        .when('/cf', {
            templateUrl: 'views/cf/cf.html'
        })
//        .when('/is', {
//            templateUrl: 'views/isolated/isolated.html'
//        })
        .when('/cb', {
            templateUrl: 'views/cb/cb.html'
        })
        .when('/blank', {
            templateUrl: 'blank.html'
        })
        .when('/error', {
            templateUrl: 'error.html'
        })
        .when('/transport-settings', {
            templateUrl: 'views/transport-settings.html'
        }).when('/forgotten', {
            templateUrl: 'views/account/forgotten.html',
            controller: 'ForgottenCtrl'
        }).when('/registration', {
            templateUrl: 'views/account/registration.html',
            controller: 'RegistrationCtrl'
        }).when('/useraccount', {
            templateUrl: 'views/account/userAccount.html'
        }).when('/glossary', {
            templateUrl: 'views/glossary.html'
        }).when('/resetPassword', {
            templateUrl: 'views/account/registerResetPassword.html',
            controller: 'RegisterResetPasswordCtrl',
            resolve: {
                isFirstSetup: function () {
                    return false;
                }
            }
        }).when('/registrationSubmitted', {
            templateUrl: 'views/account/registrationSubmitted.html'
        })
        .otherwise({
            redirectTo: '/'
        });

    $httpProvider.interceptors.push('ErrorInterceptor');

    IdleProvider.idle(7200);
    IdleProvider.timeout(30);
    KeepaliveProvider.interval(10);

    httpHeaders = $httpProvider.defaults.headers;

});


app.factory('ErrorInterceptor', function ($q, $rootScope, $location, StorageService, $window) {
    var handle = function (response) {
        if (response.status === 440) {
            response.data = "Session timeout";
            $rootScope.openSessionExpiredDlg();
        } else if (response.status === 498) {
            response.data = "Invalid Application State";
            $rootScope.openVersionChangeDlg();
        } else if (response.status === 401) {
            $rootScope.openInvalidReqDlg();
        }
    };
    return {
        responseError: function (response) {
            handle(response);
            return $q.reject(response);
        }
    };
});


app.run(function (Session, $rootScope, $location, $modal, TestingSettings, AppInfo, $q, $sce, $templateCache, $compile, StorageService, $window, $route, $timeout, $http, User, Idle, Transport, IdleService) {


    $rootScope.appInfo = {};

    $rootScope.stackPosition = 0;
    $rootScope.transportSupported = false;
    $rootScope.scrollbarWidth = null;
    $rootScope.vcModalInstance = null;
    $rootScope.sessionExpiredModalInstance = null;
    $rootScope.errorModalInstanceInstance = null;

    function getContextPath() {
        return $window.location.pathname.substring(0, $window.location.pathname.indexOf("/", 2));
    }


    Session.create().then(function (response) {
        // load current user
        User.load().then(function (response) {
            Transport.init();
        }, function (error) {
            $rootScope.openCriticalErrorDlg("Sorry we could not create a new user for your session. Please refresh the page and try again.");
        });
        // load app info
        AppInfo.get().then(function (appInfo) {
            $rootScope.appInfo = appInfo;
            $rootScope.apiLink = $window.location.protocol + "//" + $window.location.host + getContextPath() + $rootScope.appInfo.apiDocsPath;
            httpHeaders.common['rsbVersion'] = appInfo.rsbVersion;
            var previousToken = StorageService.get(StorageService.APP_STATE_TOKEN);
            if (previousToken != null && previousToken !== appInfo.rsbVersion) {
                $rootScope.openVersionChangeDlg();
            }
            StorageService.set(StorageService.APP_STATE_TOKEN, appInfo.rsbVersion);
        }, function (error) {
            $rootScope.appInfo = {};
            $rootScope.openCriticalErrorDlg("Sorry we could not communicate with the server. Please try again");
        });


    }, function (error) {
        $rootScope.openCriticalErrorDlg("Sorry we could not start your session. Please refresh the page and try again.");
    });


    $rootScope.$watch(function () {
        return $location.path();
    }, function (newLocation, oldLocation) {
        //true only for onPopState
        if ($rootScope.activePath === newLocation) {
            var back,
                historyState = $window.history.state;
            back = !!(historyState && historyState.position <= $rootScope.stackPosition);
            if (back) {
                //back button
                $rootScope.stackPosition--;
            } else {
                //forward button
                $rootScope.stackPosition++;
            }
        } else {
            //normal-way change of page (via link click)
            if ($route.current) {
                $window.history.replaceState({
                    position: $rootScope.stackPosition
                }, '');
                $rootScope.stackPosition++;
            }
        }
    });

    $rootScope.isActive = function (path) {
        return path === $rootScope.activePath;
    };

    $rootScope.setActive = function (path) {
        if (path === '' || path === '/') {
            $location.path('/home');
        } else {
            $rootScope.activePath = path;
        }
    };

    $rootScope.isSubActive = function (path) {
        return path === $rootScope.subActivePath;
    };

    $rootScope.setSubActive = function (path) {
        $rootScope.subActivePath = path;
        StorageService.set(StorageService.ACTIVE_SUB_TAB_KEY, path);
    };


});


angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
    .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) {
    }]).directive('carousel', [function () {
        return {

        }
    }]);


angular.module('hit-tool-services').factory('TabSettings',
    ['$rootScope', function ($rootScope) {
        return {
            new: function (key) {
                return{
                    key: key,
                    activeTab: 0,
                    getActiveTab: function () {
                        return this.activeTab;
                    },
                    setActiveTab: function (value) {
                        this.activeTab = value;
                        this.save();
                    },
                    save: function () {
                        sessionStorage.setItem(this.key, this.activeTab);
                    },
                    restore: function () {
                        this.activeTab = sessionStorage.getItem(this.key) != null && sessionStorage.getItem(this.key) != "" ? parseInt(sessionStorage.getItem(this.key)) : 0;
                    }
                };
            }
        };
    }]
);


app.controller('ErrorDetailsCtrl', function ($scope, $modalInstance, error) {
    $scope.error = error;
    $scope.ok = function () {
        $modalInstance.close($scope.error);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.refresh = function () {
        $modalInstance.close($window.location.reload());
    };
});

app.directive('stRatio', function () {

    return {

        link: function (scope, element, attr) {

            var ratio = +(attr.stRatio);


            element.css('width', ratio + '%');


        }

    };

});

app.controller('TableFoundCtrl', function ($scope, $modalInstance, table) {
    $scope.table = table;
    $scope.tmpTableElements = [].concat(table != null ? table.valueSetElements : []);
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


app.controller('ValidationResultInfoCtrl', [ '$scope', '$modalInstance',
    function ($scope, $modalInstance) {
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);


app.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

app.directive('stRatio', function () {
    return {

        link: function (scope, element, attr) {
            var ratio = +(attr.stRatio);
            element.css('width', ratio + '%');
        }
    };
});


app.controller('ErrorCtrl', [ '$scope', '$modalInstance', 'StorageService', '$window',
    function ($scope, $modalInstance, StorageService, $window) {
        $scope.refresh = function () {
            $modalInstance.close($window.location.reload());
        };
    }
]);

app.controller('FailureCtrl', [ '$scope', '$modalInstance', 'StorageService', '$window', 'error',
    function ($scope, $modalInstance, StorageService, $window, error) {
        $scope.error = error;
        $scope.close = function () {
            $modalInstance.close();
        };
    }
]);








