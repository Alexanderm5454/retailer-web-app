"use strict";angular.module("retailerApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","LocalStorageModule"]).config(["localStorageServiceProvider",function(a){a.setPrefix("ls")}]).config(["$routeProvider",function(a){a.when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/jewelry/:pageNumber/:category",{templateUrl:"views/main.html",controller:"MainCtrl as main"}).when("/jewelry/:pageNumber/:category/:itemPath/:index",{templateUrl:"views/item.html",controller:"ItemCtrl"}).when("/jewelry/wish-list/:itemPath/:index",{templateUrl:"views/item.html",controller:"ItemCtrl"}).when("/jewelry/wish-list",{templateUrl:"views/wish-list.html",controller:"wishListCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).otherwise({redirectTo:"/jewelry/0/earrings"})}]);var retailerApp=angular.module("retailerApp");retailerApp.factory("selectedItem",function(){return{data:{}}}),retailerApp.factory("urlPath",["$location",function(a){return{}}]),retailerApp.factory("wishList",["localStorageService",function(a){function b(){a.get("wishListItems")&&(c=a.get("wishListItems"))}var c={};return{addItem:function(d,e){if("object"==typeof d&&d.hasOwnProperty("id")){var f=d.id;b(),e in c||(c[e]={}),f in c[e]||(c[e][f]=d,a.set("wishListItems",c)),console.log("items: ",c)}else console.error("addItem function parameter 'wishListed' must be an object")},removeItem:function(d,e){if("object"==typeof d&&d.hasOwnProperty("id")){b();var f=d.id;if(e in c)f in c[e]&&(delete c[e][f],JSON.stringify(c[e])===JSON.stringify({})&&delete c[e]);else if(!e)for(var g in c)if(c.hasOwnProperty(g)&&f in c[g]){delete c[g][f],JSON.stringify(c[g])===JSON.stringify({})&&delete c[g];break}a.set("wishListItems",c),console.log("items: ",c)}},getItems:function(a){return b(),c[a]||{}}}}]),retailerApp.factory("items",["$http","$location",function(a,b){function c(b,c){console.log("Got category items");var e=b+".json";a.get("/scripts/json/"+e).then(function(a){d[b]=a.data.items,sessionStorage.setItem(b,JSON.stringify(d[b])),c&&"function"==typeof c&&c()},function(a){console.error("response: ",a)})}var d={};return{currentCategory:"",categories:[],infoList:{items:[]},itemsPerPage:15,pageNumber:0,numberOfPages:1,init:function(b){if(sessionStorage.getItem("categories"))this.categories=sessionStorage.getItem("categories").split(","),b&&"function"==typeof b&&b();else{var c=this;a.get("/retailer-accordion-display/scripts/json/categories.json").then(function(a){console.log("GOT DATA"),c.categories=a.data.categories,sessionStorage.setItem("categories",c.categories),b&&"function"==typeof b&&b()},function(a){console.error("response: ",a)})}},setItems:function(a){if(b.path()){for(var e=b.path().split("/"),f=e[3],g=0,h=this.categories.length;h>g;g++)if(f===this.categories[g]){this.currentCategory=this.categories[g];break}var i=this,j=function(){i.infoList.items.length=0;var b=0,c=i.itemsPerPage,f=parseInt(e[2],10);i.numberOfPages=Math.ceil(d[i.currentCategory].length/i.itemsPerPage);for(var g=0,h=i.numberOfPages;h>g;g++)if(f===g){i.pageNumber=g;break}b=i.pageNumber*i.itemsPerPage,c=b+i.itemsPerPage,i.infoList.items=d[i.currentCategory].slice(b,c),a&&"function"==typeof a&&a()};sessionStorage.getItem(this.currentCategory)?(d[this.currentCategory]=JSON.parse(sessionStorage.getItem(this.currentCategory)),j()):(""===this.currentCategory&&b.path("jewelry/"+this.categories[0]),c(this.currentCategory,j))}}}}]),retailerApp.controller("MainCtrl",["$scope","$http","$timeout","$location","localStorageService","items","wishList",function(a,b,c,d,e,f,g){var h=this;h.categories=[],a.currentCategory="",a.infoList={items:[]},a.pageNumber=0,a.numberOfPages=1,a.showPageNumbers=!1,f.init(function(){h.categories=f.categories,f.setItems(function(){a.infoList.items=f.infoList.items,a.pageNumber=f.pageNumber,a.numberOfPages=f.numberOfPages}),a.currentCategory=f.currentCategory});var i=g.getItems(f.currentCategory);a.inWishList=function(a){return a in i},a.setCategory=function(b){a.pageNumber=0,d.path("jewelry/"+a.pageNumber+"/"+b),$("body, html").animate({scrollTop:0},0)},a.pageNav=function(b){var c=!1;"next"===b&&a.pageNumber<a.numberOfPages-1?(a.pageNumber++,c=!0):"previous"===b&&a.pageNumber>0&&(a.pageNumber--,c=!0),c===!0&&(d.path("jewelry/"+a.pageNumber+"/"+a.currentCategory),$("body, html").animate({scrollTop:0},0))},a.numberOfPagesDisplay=function(){return a.showPageNumbers=a.numberOfPages>1,new Array(a.numberOfPages)},a.setPageNumber=function(b){a.pageNumber=b,d.path("jewelry/"+a.pageNumber+"/"+a.currentCategory),$("body, html").animate({scrollTop:0},0)},a.sortItemsByPrice=function(b){a.infoList.items.sort(function(a,c){var d,e;return"high"===b?(d=c,e=a):(d=a,e=c),d.price>e.price?1:-1})}}]),retailerApp.directive("scroll",["$window","$document",function(a,b){return function(b,c,d){var e=($("body"),$(".collapsibleDisplay")),f=0;angular.element(a).bind("scroll",function(){if(this.pageYOffset+f>=this.innerHeight){console.log("Bottom Reached"),f=0;var a=b.infoList.items.length;console.log("numberOfItems: ",a),b.infoList.items=b.allItems[b.currentCategory].slice(0,a+2),b.$apply()}else f=e.height()})}}]),retailerApp.directive("grid",["selectedItem","wishList","$location",function(a,b,c){return{restrict:"E",templateUrl:"views/grid.html",link:function(d,e){var f=$(e.find(".wishListIcon")[0]),g={delay:{show:400,hide:100},title:"Add to Wish List"};e.on("mouseover",function(){var a=e.find(".wishListIcon")[0];a.style.visibility="visible",f.hasClass("wishListIconSelected")&&(g.title="Remove from Wish List"),f.attr("data-toggle","tooltip").tooltip(g)}).on("mouseout",function(){e.find(".wishListIconNotSelected")[0]&&(e.find(".wishListIconNotSelected")[0].style.visibility="hidden")}),f.on("click",function(a){a.stopPropagation();var c=+$(e.children()[0]).context.id;if($(this).hasClass("wishListIconNotSelected")){var f=d.infoList.items[c];b.addItem(f,d.currentCategory),$(this).addClass("wishListIconSelected").removeClass("wishListIconNotSelected"),g.title="Remove from Wish List"}else if($(this).hasClass("wishListIconSelected")){var h=d.infoList.items[c];b.removeItem(h,d.currentCategory),$(this).removeClass("wishListIconSelected").addClass("wishListIconNotSelected"),g.title="Add to Wish List"}$(this).tooltip("hide").attr("data-original-title",g.title).tooltip("fixTitle").tooltip(g)}),e.on("click",function(b){b.stopPropagation(),d.index=+$(e.children()[0]).context.id,a.data=d.infoList.items[d.index],d.itemPath=a.data.title.toLowerCase().split(/[\s]+/).join("-"),c.path("jewelry/"+d.pageNumber+"/"+d.currentCategory+"/"+d.itemPath+"/"+d.index),d.$apply()})}}}]),retailerApp.directive("collapsible",["$window",function(a){return{restrict:"E",templateUrl:"views/collapsible.html",link:function(b,c){function d(){var b=a.outerHeight,c=i.offset().top;k.attr("src",j.attr("src").replace("thumb_","")),j.fadeOut(),$("body, html").animate({scrollTop:c}),k.animate({opacity:1},800),h.addClass("expand").css({height:b}),k.on("click",f),i.off("click",d),i.on("click",e)}function e(){b.currentItem="",h.removeClass("expand").css({height:"75px",transition:".8s"}),k.animate({opacity:0},320),j.delay(200).fadeIn(),k.hasClass("zoom")&&g(),i.on("click",d),i.off("click",e),k.on("click",d)}function f(){k.addClass("zoom"),l.fadeOut(),k.css({marginLeft:"12%"}),k.off("click",f),k.on("click",g)}function g(){k.css({marginLeft:0}),k.removeClass("zoom").css({transition:".5s"}),l.fadeIn(),k.off("click",g),k.on("click",f)}var h=$(c.children()[0]),i=h.find(".collapsibleHeader"),j=h.find(".collapsibleImgSmall"),k=h.find(".collapsibleImgLarge"),l=h.find(".content");i.on("click",d),j.on("click",d)}}}]),retailerApp.directive("compareItem",function(){return{restrict:"E",templateUrl:"views/compareItem.html",link:function(a,b){for(var c=b.parent(),d=c.width()+25,e=0,f=0,g=a.compareItems.length;g>f;f++)e=f*d;$(c).css({left:e})}}}),retailerApp.directive("cartItem",function(){return{restrict:"E",templateUrl:"views/cartItem.html"}}),retailerApp.filter("firstLetterCaps",function(){return function(a){if(a){var b=a.charAt(0).toUpperCase(),c=a.slice(1,a.length);return b+c}}});var retailerApp=angular.module("retailerApp");retailerApp.controller("ItemCtrl",["$scope","$location","selectedItem","items",function(a,b,c,d){a.infoList={items:[]},a.pageNumber=0,a.setCategory=function(c){b.path("jewelry/"+a.pageNumber+"/"+c)},a.item=c.data,a.loadItem=function(){a.item&&JSON.stringify(a.item)!==JSON.stringify({})?(a.categories=d.categories,$("body, html").animate({scrollTop:0},0)):d.init(function(){a.categories=d.categories,d.setItems(function(){var c=b.path().split("/"),e=parseInt(c[c.length-1],10),f=-1;console.log("path: ",e);for(var g=0,h=d.infoList.items.length;h>g;g++)if(e===g){f=g;break}a.item=d.infoList.items[f]})})}}]);var retailerApp=angular.module("retailerApp");retailerApp.controller("wishListCtrl",["$scope","wishList","items","$location",function(a,b,c,d){a.infoList={items:[]},a.loadWishList=function(){c.categories.length>0?a.categories=c.categories:c.init(function(){a.categories=c.categories});for(var d=0,e=a.categories.length;e>d;d++){var f=b.getItems(a.categories[d]);for(var g in f)f.hasOwnProperty(g)&&a.infoList.items.push(f[g])}},a.setCategory=function(b){a.pageNumber=0,d.path("jewelry/"+a.pageNumber+"/"+b),$("body, html").animate({scrollTop:0},0)}}]),retailerApp.directive("wishListItem",["selectedItem","$location","wishList",function(a,b,c){return{restrict:"E",templateUrl:"views/wishListItem.html",link:function(d,e){var f=$(e.children().find(".removeFromWishList"));e.on("click",function(c){c.stopPropagation(),d.index=+$(e.children()[0]).context.id,a.data=d.infoList.items[d.index],d.itemPath=a.data.title.toLowerCase().split(/[\s]+/).join("-"),b.path("/jewelry/wish-list/"+d.itemPath+"/"+d.index),d.$apply()}),f.on("click",function(a){a.stopPropagation();var b=$(e.children()[0]);b.fadeOut(800,function(){var a=+b.context.id,e=d.infoList.items[a];c.removeItem(e),d.infoList.items.length=0,d.loadWishList(),d.$apply(),b.fadeIn(0)})})}}}]),angular.module("retailerApp").controller("AboutCtrl",["$scope",function(a){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("retailerAccordionDisplayApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/cartItem.html",'<div class="cartItem"> <img class="cartImage" ng-src="{{ cartItem.image }}"> <p class="cartItemName">{{ cartItem.title }}</p> <span class="removeFromCart" ng-click="removeFromCart(cartItem)">Remove From Cart</span> <span class="cartItemPrice">{{ cartItem.price | currency:$ }}</span> </div>'),a.put("views/collapsible.html",'<div class="collapsibleItem"> <img class="collapsibleImgSmall" ng-src="{{ item.imageThumb }}"> <div class="collapsibleHeader"> <span class="collapsibleTitle">{{ item.title }}</span> <p class="itemPrice">{{ item.price | currency:$ }}</p> <span class="collapsibleDescription">{{ item.description }}</span> <span class="cartStatus" ng-show="item.inCart" ng-click="switchView(\'cart\')"><em>In Cart</em></span> </div> <img class="collapsibleImgLarge"> <span class="content"> <p class="collapsibleContent">{{ item.content }}</p> <span class="addToCart" ng-click="addToCart(item)">Add to Cart</span> <span class="compare" ng-click="addCompare(item)">Compare</span> </span> </div> <script>/*\n        $(\'.collapsibleDisplay\').fadeOut(100);\n        $(\'.shoppingCartDisplay\').hide();\n        $(\'.compareDisplay\').hide();\n        $(\'.sortItems\').show();\n\n        function display(delay) {\n            if (!delay) {\n                delay = 150;\n            }\n            $timeout(function() {\n                $scope.currentCategory = category;\n                $scope.infoList.items = $scope.allItems[category].slice();\n                $timeout(function() {\n                    $(\'.collapsibleDisplay\').fadeIn("fast");\n                //    $location.path($scope.currentCategory);\n                }, 100);\n            }, delay);\n        }\n\n        if ($scope.allItems[category]) {\n            display(150);\n        } else {\n            getCategoryItems(category, display, 150);\n        }\n        */</script>'),a.put("views/compareItem.html",'<img class="compareImg" ng-src="{{ compare.image }}"> <span class="removeCompare" ng-click="removeCompare(compare)">Remove</span> <span class="addToCartCompare" ng-click="addToCart(compare)">Add to Cart</span> <p class="compareTitle">{{ compare.title }}</p> <span class="comparePrice">{{ compare.price | currency:$ }}</span>'),a.put("views/grid.html",'<span id="{{ $index }}" class="gridItem"> <span ng-class="inWishList(item.id) ? \'wishListIconSelected\' : \'wishListIconNotSelected\'" class="wishListIcon btn btn-default glyphicon glyphicon-heart"></span> <img class="gridImageSmall" ng-src="{{ item.imageThumb }}"> <span class="gridItemTitle">{{ item.title }}</span> <span class="gridItemPrice">{{ item.price | currency:$ }}</span> </span>'),a.put("views/item.html",'<div class="categories"> <span class="category" ng-click="setCategory(category)" ng-repeat="category in categories"> {{ category | firstLetterCaps }} </span> <a href="#/jewelry/wish-list"><span class="category">Wish List</span></a> </div> <div class="itemContainer" ng-init="loadItem()"> <div class="itemTitle">{{ item.title }}</div> <div class="gridImageLargeContainer"> <img class="gridImageLarge" src="{{ item.image }}"> </div> <span>{{ item.description }}</span> <br> <span>{{ item.content }}</span> </div>'),a.put("views/main.html",'<div class="container"> <!--\n    <div class="categories">\n        <span class="category" ng-click="setCategory(category)" ng-repeat="category in main.categories">\n            {{ category | firstLetterCaps }}\n        </span>\n    </div>\n    --> <!--\n    <span class="cartNav" ng-click="switchView(\'cart\')">Shopping Cart:\n        {{ cartItemsLength || "Empty" }}\n    </span>\n    <span class="compareNav" ng-click="switchView(\'compare\')">Compare:\n        {{ compareItemsLength }}\n    </span>\n    <span class="sortItems"><p class="searchText">Sort/Search</p>\n        <div>\n            <span ng-click="sortItemsByPrice(\'low\')">Price Low</span>\n            <span ng-click="sortItemsByPrice(\'high\')">Price High</span>\n        </div>\n        <form class="form-search">\n            <div class="input-append">\n                <input placeholder="Search" type="text" class="span2 search-query" ng-model="searchTerms">\n                <button class="btn btn-default glyphicon glyphicon-search" ng-click="searchItems()"></button>\n            </div>\n        </form>\n    </span>\n    --> <span class="categoryTitle">{{ currentCategory | firstLetterCaps }}</span> <ul class="navContainer"> Jewelry <li class="category" ng-click="setCategory(category)" ng-repeat="category in main.categories"> {{ category | firstLetterCaps }} </li> <a href="#/jewelry/wish-list"><li class="category">Wish List</li></a> <li>Shopping Cart: {{ cartItemsLength || "Empty" }} </li> <li><p class="searchText">Sort/Search</p> <div> <span ng-click="sortItemsByPrice(\'low\')">Price Low</span> <span ng-click="sortItemsByPrice(\'high\')">Price High</span> </div> <form class="form-search"> <div class="input-append"> <input placeholder="Search" type="text" class="span2 search-query" ng-model="searchTerms"> <button class="btn btn-default glyphicon glyphicon-search" ng-click="searchItems()"></button> </div> </form> </li> </ul> <div class="gridDisplay"> <span class="pageNavContainer"> <span ng-show="showPageNumbers"> <span class="previousPage glyphicon glyphicon-menu-left" ng-click="pageNav(\'previous\')"></span> <span class="pageNumbers" ng-class="{\'currentPageNumber\': pageNumber === $index}" ng-repeat="page in numberOfPagesDisplay() track by $index" ng-click="setPageNumber($index)">{{ $index + 1 }}</span> <span class="nextPage glyphicon glyphicon-menu-right" ng-click="pageNav(\'next\')"></span> </span> </span> <span class="gridItemWrapper" ng-repeat="item in infoList.items"> <grid></grid> </span> </div> <span ng-show="showPageNumbers" class="pageNavContainer"> <span class="previousPage glyphicon glyphicon-menu-left" ng-click="pageNav(\'previous\')"></span> <span class="pageNumbers" ng-class="{\'currentPageNumber\': pageNumber === $index}" ng-repeat="page in numberOfPagesDisplay() track by $index" ng-click="setPageNumber($index)">{{ $index + 1 }}</span> <span class="nextPage glyphicon glyphicon-menu-right" ng-click="pageNav(\'next\')"></span> </span> <!--\n    <div class="collapsibleDisplay">\n        <h2 class="displayTitle">{{ currentCategory || "" | firstLetterCaps }}</h2>\n        <div ng-repeat="item in infoList.items">\n            <collapsible></collapsible>\n        </div>\n    </div>\n    --> <div class="compareDisplay"> <h2 class="displayTitle">Compare</h2> <ul> <li ng-repeat="compare in compareItems"> <compare-item></compare-item> </li> </ul> </div> <div class="shoppingCartDisplay"> <h2 class="displayTitle">Shopping Cart</h2> <div ng-repeat="cartItem in cartItems"> <cart-item></cart-item> </div> <div class="cartBottomLine"> <span class="grandTotal">Grand Total: {{ grandTotal | currency:$ }}</span> </div> </div> </div>'),a.put("views/wish-list.html",'<div class="container" ng-init="loadWishList()"> <span class="categoryTitle">Wish List</span> <ul class="navContainer"> Jewelry <li class="category" ng-click="setCategory(category)" ng-repeat="category in categories"> {{ category | firstLetterCaps }} </li> <a href="#/jewelry/wish-list"><li class="category">Wish List</li></a> <li>Shopping Cart: {{ cartItemsLength || "Empty" }} </li> <li><p class="searchText">Sort/Search</p> <div> <span ng-click="sortItemsByPrice(\'low\')">Price Low</span> <span ng-click="sortItemsByPrice(\'high\')">Price High</span> </div> <form class="form-search"> <div class="input-append"> <input placeholder="Search" type="text" class="span2 search-query" ng-model="searchTerms"> <button class="btn btn-default glyphicon glyphicon-search" ng-click="searchItems()"></button> </div> </form> </li> </ul> <div class="gridDisplay"> <span class="pageNavContainer"> </span> <span class="gridItemWrapper" ng-repeat="item in infoList.items track by $index"> <wish-list-item></wish-list-item> </span> </div> </div>'),a.put("views/wishListItem.html",'<span id="{{ $index }}" class="wishListItem"> <img class="gridImageSmall" ng-src="{{ item.imageThumb }}"> <span class="wishListTitle">{{ item.title }}</span> <span class="wishListPrice">{{ item.price | currency:$ }}</span> <span class="removeFromWishList btn btn-default">Remove</span> </span>')}]);
