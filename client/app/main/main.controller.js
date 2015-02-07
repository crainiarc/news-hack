'use strict';

angular.module('newsHackApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.validatePost = function(post) {
      var contentCount = 0;
      if (post.hasOwnProperty('picture')) {
        contentCount ++;
      };

      if (post.hasOwnProperty('name')) {
        contentCount ++;
      };

      if (post.hasOwnProperty('description') || post.hasOwnProperty('message')) {
        contentCount ++;
      };

      return contentCount >= 2;
    }


    $scope.loadPage = function (feedObj) {
      $scope.currentCategory = "";
      $scope.json = JSON.parse(feedObj);
      $scope.categories = [];
      $scope.categoryPosts = [];
      console.log("testing!");
      var categories = [];
      var categoryPosts = [];
      for (var key in $scope.json) {
        if ($scope.json.hasOwnProperty(key)) {
          //console.log("Key is " + key);
          var currentPost = $scope.json[key];
          if ($scope.validatePost(currentPost)) {
            var categoryArr = currentPost.category;
            var arrayLength = categoryArr.length;
            for(var i = 0; i < arrayLength; i ++) {
              if (categories.hasOwnProperty(categoryArr[i])) {
                categories[categoryArr[i]] = categories[categoryArr[i]] + 1;
              } else {
                categories[categoryArr[i]] = 1;
                categoryPosts[categoryArr[i]] = [];
              };
              categoryPosts[categoryArr[i]].push(currentPost);
            }
            
          };
        }
      }
      var sortCategory = function() {
        for (var key in categories) {
          if (categories.hasOwnProperty(key)) {
            $scope.categories.push(key);
          };
        }
        $scope.categories.sort(function(a, b){
          return categories[b] - categories[a];
        });
      };
      sortCategory();
      $scope.categoryPosts = categoryPosts;
      //$scope.currentCategory = "";
      $scope.changeCurrentCategory = function(currentCategory) {
        $scope.currentCategory = currentCategory;
      };
    }

    $http.get('/feed').success(function(feedObj) {
      $scope.json = JSON.parse(feedObj);
      for (var key in $scope.json) {
        if ($scope.json.hasOwnProperty(key)) {
          //console.log("Key is " + key);
          var currentPost = $scope.json[key];
          if ($scope.validatePost(currentPost)) {
            var categoryArr = currentPost.category;
            var arrayLength = categoryArr.length;
            for(var i = 0; i < arrayLength; i ++) {
              if ($scope.categories.indexOf(categoryArr[i]) <= -1) {
                $scope.categories.push(categoryArr[i]);
                $scope.categoryPosts[categoryArr[i]] = [];
              } else {
                console.log("New post in category " + categoryArr[i]);
              }
              $scope.categoryPosts[categoryArr[i]].unshift(currentPost);
            }
            
          };
        }
      }
      $scope.$apply();
    });

    $http.get('/cache').success(function(feedObj) {
      $scope.loadPage(feedObj);
      $scope.changeCurrentCategory($scope.categories[0]);
    });

    $http.get('/profile').success(function(userInfo) {
      var userInfoArr = userInfo.split("asd1232");
      $scope.currentUser = userInfoArr[0];
      $scope.currentUserName = userInfoArr[1];
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };


  });
