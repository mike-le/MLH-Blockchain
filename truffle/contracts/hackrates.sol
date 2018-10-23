pragma solidity ^0.4.16;

contract HackRates {
  event newRating(uint id);

  struct Rating {
    uint projectID;
    uint creativity;
    uint technicalComplexity;
    uint bestPractices;
  }

  Rating[] ratings;

  function addRating(
    uint projectID,
    uint creativity,
    uint technicalComplexity,
    uint bestPractices
  ) public returns (uint ratingID) {
    ratingID = ratings.length;
    ratings[ratings.length++] = Rating(projectID, creativity, technicalComplexity, bestPractices);
    emit newRating(ratingID);
  }

  function getRatingsCount() constant public returns (uint count) {
    return ratings.length;
  }

  function getRating(uint index) constant public returns (
    uint projectID,
    uint creativity,
    uint technicalComplexity,
    uint bestPractices
  ) {
    projectID = ratings[index].projectID;
    creativity = ratings[index].creativity;
    technicalComplexity = ratings[index].technicalComplexity;
    bestPractices = ratings[index].bestPractices;
  }
}
