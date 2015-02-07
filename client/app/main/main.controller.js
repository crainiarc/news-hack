'use strict';

angular.module('newsHackApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
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

    $scope.categories = [];
    $scope.categoryPosts = [];
    console.log("testing!");
    var jsonStr = "{\"10152859214399425_10152861258039425\":{\"id\":\"10152859214399425_10152861258039425\",\"category\":\"Technology\",\"importance\":3,\"from\":{\"id\":\"10152859214399425\",\"name\":\"Teoh Tick Meng\"},\"message\":\"#awww so cute. I really love that! Thank you very much for put this online!!!\",\"picture\":\"https://fbexternal-a.akamaihd.net/safe_image.php?d=AQCCiyp-kFiS-RRJ&w=158&h=158&url=http%3A%2F%2Fimages-cdn.9gag.com%2Fimages%2Fthumbnail-facebook%2F15252212_1422937590.6025_ezuSuS_n.jpg\",\"link\":\"http://9gag.com/gag/a4d94bZ?ref=fb.s.mw\",\"name\":\"13 Things Your Toddler Can Do That You Can't\",\"caption\":\"9gag.com\",\"description\":\"Click to see the pic and write a comment...\",\"icon\":\"https://fbstatic-a.akamaihd.net/rsrc.php/v2/yD/r/aS8ecmYRys0.gif\",\"actions\":[{\"name\":\"Comment\",\"link\":\"https://www.facebook.com/10152859214399425/posts/10152861258039425\"},{\"name\":\"Like\",\"link\":\"https://www.facebook.com/10152859214399425/posts/10152861258039425\"}],\"privacy\":{\"value\":\"\"},\"type\":\"link\",\"status_type\":\"shared_story\",\"application\":{\"name\":\"Share_bookmarklet\",\"id\":\"5085647995\"},\"created_time\":\"2015-02-07T04:53:54+0000\",\"updated_time\":\"2015-02-07T04:53:54+0000\",\"likes\":{\"data\":[{\"id\":\"10153038219879501\",\"name\":\"Riyanti Susanto\"}],\"paging\":{\"cursors\":{\"after\":\"MTAxNTMwMzgyMTk4Nzk1MDE=\",\"before\":\"MTAxNTMwMzgyMTk4Nzk1MDE=\"}}}},\"10152859214399425_10152861258039426\":{\"id\":\"10152859214399425_10152861258039425\",\"category\":\"Game\",\"importance\":2,\"from\":{\"id\":\"10152859214399425\",\"name\":\"Teoh Tick Meng\"},\"message\":\"#awww so cute. I really love that! Thank you very much for put this online!!!\",\"picture\":\"https://fbexternal-a.akamaihd.net/safe_image.php?d=AQCCiyp-kFiS-RRJ&w=158&h=158&url=http%3A%2F%2Fimages-cdn.9gag.com%2Fimages%2Fthumbnail-facebook%2F15252212_1422937590.6025_ezuSuS_n.jpg\",\"link\":\"http://9gag.com/gag/a4d94bZ?ref=fb.s.mw\",\"name\":\"13 Things Your Toddler Can Do That You Can't\",\"caption\":\"9gag.com\",\"description\":\"Click to see the pic and write a comment...\",\"icon\":\"https://fbstatic-a.akamaihd.net/rsrc.php/v2/yD/r/aS8ecmYRys0.gif\",\"actions\":[{\"name\":\"Comment\",\"link\":\"https://www.facebook.com/10152859214399425/posts/10152861258039425\"},{\"name\":\"Like\",\"link\":\"https://www.facebook.com/10152859214399425/posts/10152861258039425\"}],\"privacy\":{\"value\":\"\"},\"type\":\"link\",\"status_type\":\"shared_story\",\"application\":{\"name\":\"Share_bookmarklet\",\"id\":\"5085647995\"},\"created_time\":\"2015-02-07T04:53:54+0000\",\"updated_time\":\"2015-02-07T04:53:54+0000\",\"likes\":{\"data\":[{\"id\":\"10153038219879501\",\"name\":\"Riyanti Susanto\"}],\"paging\":{\"cursors\":{\"after\":\"MTAxNTMwMzgyMTk4Nzk1MDE=\",\"before\":\"MTAxNTMwMzgyMTk4Nzk1MDE=\"}}}}}";
    // $.getJSON("./test.json", function(json) {
    //   console.log(json); // this will show the info it in firebug console
    // });
    var categories = [];
    var categoryPosts = [];
    var json = JSON.parse(jsonStr);
    for (var key in json) {
      if (json.hasOwnProperty(key)) {
        var currentPost = json[key];
        var category = currentPost.category;
        if (categories.hasOwnProperty(category)) {
          categories[category] = categories[category] + 1;
        } else {
          categories[category] = 1;
          categoryPosts[category] = [];
        };
        categoryPosts[category].push(currentPost);
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
  });
