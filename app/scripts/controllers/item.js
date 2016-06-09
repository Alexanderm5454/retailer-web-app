(function(jq) {
    'use strict';

    /**
     * @ngdoc function
     * @name retailerApp.controller:ItemCtrl
     * @description
     * # ItemCtrl
     * Controller of the retailerApp
     */

    var retailerApp = angular.module('retailerApp');

    retailerApp.controller('ItemCtrl', ["$scope", "$location", "selectedItem", "items", "categoryData", "baseUrl", "urlPath",
        function ($scope, $location, selectedItem, items, categoryData, baseUrl, urlPath) {
            $scope.infoList = {items: []};
            $scope.pageNumber = 0;
            $scope.pathDisplay = [];
            $scope.categoriesAndSubs = [];

            $scope.setCategory = function(index, category) {
                urlPath.loadCategoryPage(urlPath.path.pageNumber, category);
            };

            $scope.item = selectedItem.data;


            $scope.loadItem = function () {
                $scope.categories = categoryData.categories;
                if (!$scope.item || JSON.stringify($scope.item) === JSON.stringify({})) {
                    var fullPath = $location.path().split("/"),
                        path = parseInt(fullPath[fullPath.length - 1], 10),
                        index = -1;

                    items.setItems($scope.categories, function() {
                        for (var i = 0, len = items.infoList.items.length; i < len; i++) {
                            if (path === i) {
                                index = i;
                                break;
                            }
                        }
                        $scope.item = items.infoList.items[index];
                    });

                } else {
                    jq("body, html").animate({scrollTop: 0}, 0);
                }

                $scope.categoriesAndSubs.push($scope.item.category);
                if ($scope.item.sub_categories.length > 0) {
                    for (var i = 0, len = $scope.item.sub_categories.length; i < len; i++) {
                        $scope.categoriesAndSubs.push($scope.item.sub_categories[i]);
                    }
                }

                /* For use with ES6 (uses the ... operator not defined in ES5)
                $scope.categoriesAndSubs = $scope.item.sub_categories.length ? [$scope.item.category,...$scope.item.sub_categories] :
                [$scope.item.category];
                */
            };

        }]);


    retailerApp.directive("wishListButton", ["wishList", function (wishList) {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "views/wishListButton.html",
            link: function (scope, element) {
                scope.wishListButtonText = "Add to Wish List";
                var wishListItems = wishList.getArrayItems(),
                    inWishList = false;

                scope.inWishListArray = function (id) {
                    for (var i = 0, len = wishListItems.length; i < len; i++) {
                        if (wishListItems[i].id === id) {
                            scope.wishListButtonText = "Remove from Wish List";
                            inWishList = true;
                            break;
                        }
                    }
                    return inWishList;
                };

                jq(element).on("click", function () {
                    if (inWishList) {
                        wishList.removeItem(scope.item);
                        inWishList = false;
                        jq(this).removeClass("itemInWishList").addClass("itemNotInWishList");
                        jq(this).text("Add to Wish List");
                    } else {
                        wishList.addItem(scope.item);
                        inWishList = true;
                        jq(this).removeClass("itemNotInWishList").addClass("itemInWishList");
                        jq(this).text("Remove from Wish List");
                    }
                });
            }
        };
    }]);

}(jQuery));