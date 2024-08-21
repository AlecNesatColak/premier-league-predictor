const url = "https://www.premierleague.com/tables";

async function getPremierLeaguePoints() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const teamPoints = {};

    // Loop through each team row in the table
    $(".tableBodyContainer .standingsTable .team").each((i, el) => {
      const teamName = $(el).find("a").text().trim(); // Target the anchor tag for team name
      const points = $(el).closest("tr").find(".points").text().trim(); // Target the points for the same row

      if (teamName && points) {
        teamPoints[teamName] = parseInt(points, 10);
        console.log(`Scraped: ${teamName} - ${points} points`); // Debugging
      } else {
        console.log("Failed to scrape team or points for a row."); // Debugging
      }
    });

    console.log("Final team points:", teamPoints); // Debugging
    return teamPoints;
  } catch (error) {
    console.error("Error fetching the data:", error);
    return {};
  }
}
