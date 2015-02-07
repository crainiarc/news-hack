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
            var category = currentPost.category;
            if (categories.hasOwnProperty(category)) {
              categories[category] = categories[category] + 1;
            } else {
              categories[category] = 1;
              categoryPosts[category] = [];
            };

            categoryPosts[category].push(currentPost);
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
      $scope.currentCategory = $scope.categories[0];
      $scope.changeCurrentCategory = function(currentCategory) {
        $scope.currentCategory = currentCategory;
      };
    }

    $http.get('/feed').success(function(feedObj) {
      $scope.loadPage(feedObj);
    });

    $http.get('/cache').success(function(feedObj) {
      $scope.loadPage(feedObj);
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
