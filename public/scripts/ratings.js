var projects = getProjectsData();
var webServerURL = "";
var id;

$(function () {
  // Show the project data
  id = getParam("id");

  if (id === null || (id < 0 || id > 5)) {
    window.location.href = "/";
    return;
  }

  $("#project-name").text(projects[id].name);
  $("#project-image").attr("src", projects[id].image);
  $("#project-description").text(projects[id].description);


  // Show existing ratings for this project
  callXHR("GET", webServerURL + "/count", null, function(err, count) {
    if (err) {
      console.log(err);
    }
    else {
      for (var i = 0; i < count; i++) {
        callXHR("GET", webServerURL + "/rating/" + i, null, function(err, rating) {
          if (err) {
            console.log(err);
          }
          else if (rating.projectID == id) {
            showRating(rating.creativity, rating.technicalComplexity, rating.bestPractices);
          }
        })
      }
    }
  });


  function allRatingsChecked() {
    var creativity = document.querySelector("#creativity img").src.includes("star-filled");
    var bestPractices =  document.querySelector("#best-practices img").src.includes("star-filled");
    var technicalComplexity = document.querySelector("#technical-complexity img").src.includes("star-filled");

    return creativity && bestPractices && technicalComplexity
  }


  // Make the star ratings interactive
  $(".stars-rating img").click(function(e) {
    //get the folder before
    var folderName =$(this).closest('div').attr('id');
    var parent = $(this).parent('.rate-images');
    var index = parseInt(e.target.dataset.value) - 1;
    parent.find("img").each(function(i, el) {
      el.src = (i <= index) ? "/img/" + folderName + "/star-filled.png" : "/img/" + folderName + "/star-empty.png";
    });

    if(allRatingsChecked()){
      $("#submit-button").removeAttr("disabled");
    }
  });

  // Process clicks of the Submit button
  $("#submit-button").click(function (e) {
    var creativity = 0;
    var technicalComplexity = 0;
    var bestPractices = 0;
    $("#creativity img").each(function(i, el) {
      if (el.src.endsWith("filled.png")) {
        creativity++;
      }
    });
    $("#technical-complexity img").each(function(i, el) {
      if (el.src.endsWith("filled.png")) {
        technicalComplexity++;
      }
    });
    $("#best-practices img").each(function(i, el) {
      if (el.src.endsWith("filled.png")) {
        bestPractices++;
      }
    });

    addRating(id, creativity, technicalComplexity, bestPractices);
    showRating(creativity, technicalComplexity, bestPractices);

    $("#creativity img").attr("src", "/img/creativity/star-empty.png");
    $("#technical-complexity img").attr("src", "/img/technical-complexity/star-empty.png");
    $("#best-practices img").attr("src", "/img/best-practices/star-empty.png");
    $("#submit-button").attr("disabled", true);
    e.preventDefault();
  });
});

function showRating(creativity, technicalComplexity, bestPractices)
{
  var parent = $("<div></div>").addClass("rating-wrapper");
  var creativityEl = $(".creativity-rating" + creativity).clone(false);
  creativityEl.removeAttr("class").addClass("creativity-rating-page");
  var technicalComplexityEl = $(".technical-complexity-rating" + technicalComplexity).clone(false);
  technicalComplexityEl.removeAttr("class").addClass("technical-complexity-rating-page");
  var bestPracticesEl = $(".best-practices-rating" + bestPractices).clone(false);
  bestPracticesEl.removeAttr("class").addClass("best-practices-rating-page");
  var separator = $("<hr>");

  parent.append(creativityEl).append(technicalComplexityEl).append(bestPracticesEl).append(separator);
  $("#ratings").append(parent);
}

function getParam(name) {
  var results = new RegExp("[\?&]" + name + "=([^]*)").exec(window.location.href);
  if (results === null)
  return null;
  return results[1] || 0;
}

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

function addRating(projectID, creativity, technicalComplexity, bestPractices) {
  var formData = "projectID=" + encodeURIComponent(projectID);
  formData += "&creativity=" + encodeURIComponent(creativity);
  formData += "&technicalComplexity=" + encodeURIComponent(technicalComplexity);
  formData += "&bestPractices=" + encodeURIComponent(bestPractices);

  callXHR("POST", webServerURL + "/add", formData, function(err, ratingId) {
    if (err) {
      console.log(err);
    }
  });
}
