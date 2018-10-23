function callXHR(method, URL, formData, callback) {
  var request = new XMLHttpRequest();
  request.open(method, URL);

  if (method == "POST") {
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(formData);
  }
  else {
    request.send();
  }

  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status < 300) {
      callback(null, JSON.parse(request.responseText));
    }
    else if (request.readyState == 4 && request.status >= 300) {
      callback(request.responseText, null);
    }
  };
}

function renderProjects(projects) {
  var template = $('#project-template');
  var projectList = $('#projects-list');

  for (var i = 0; i < projects.length; i++) {
    var project = projects[i];
    var projectMarkup = template.clone().attr("id", "project-" + i);

    projectMarkup.find(".project-url").attr("href", "/ratings?id=" + i);
    projectMarkup.find(".project-name").text(project.name);
    projectMarkup.find(".project-description").text(project.description);
    projectList.append(projectMarkup);
    projectMarkup.removeClass("hidden");
  }
};

function truncateProjectDescriptions() {
  const selector = '.project-description';
  $(selector).shave($(selector).height());
};

$(document).ready(function() {
  var projects = getProjectsData();
  var webServerURL = "";

  renderProjects(projects);
  truncateProjectDescriptions();

  // Load existing ratings and show ratings and comment counts
  callXHR("GET", webServerURL + "/count", null, function(err, count) {
    if (err) {
      console.log(err);
    }
    else {
      var completed = 0;
      var creativityRating = [	[0,0], [0,0], [0,0], [0,0], [0,0], [0,0] ];
      var technicalComplexityRating = [	[0,0], [0,0], [0,0], [0,0], [0,0], [0,0] ];
      var bestPracticesRatings = [	[0,0], [0,0], [0,0], [0,0], [0,0], [0,0] ];

      for (var i = 0; i < count; i++) {
        callXHR("GET", webServerURL + "/rating/" + i, null, function(err, rating) {
          if (err) {
            console.log(err);
          }
          else {
            var id = parseInt(rating.projectID);
            creativityRating[id][0] += rating.creativity;
            technicalComplexityRating[id][0] += rating.technicalComplexity;
            bestPracticesRatings[id][0] += rating.bestPractices;
            creativityRating[id][1]++;

          }

          if (count == ++completed) {
            for (var j = 0; j < 4; j++) {
              var creativityRatingSum = creativityRating[j][0];
              var technicalComplexityRatingSum = technicalComplexityRating[j][0];
              var bestPracticesRatingSum = bestPracticesRatings[j][0];

              var ratingsCount = creativityRating[j][1];

              if (ratingsCount > 0) {
                var averageCreativity = Math.round(creativityRatingSum / ratingsCount);
                var averageTechnicalComplexity = Math.round(technicalComplexityRatingSum / ratingsCount);
                var averageBestPractices = Math.round(bestPracticesRatingSum / ratingsCount);
                $("#project-" + j + " .creativity-rating .stars").attr("src", "/img/creativity/stars" + averageCreativity + "-creativity.png");
                $("#project-" + j + " .technical-complexity-rating .stars").attr("src", "/img/technical-complexity/stars" + averageTechnicalComplexity + "-technical-complexity.png");
                $("#project-" + j + " .best-practices-rating .stars").attr("src", "/img/best-practices/stars" + averageBestPractices + "-best-practices.png");
              }
            }
          }
        });
      }
    }
  });
});
