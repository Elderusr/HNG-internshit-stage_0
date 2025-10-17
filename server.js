const http = require("http");

const PORT = 3000;

// Function to fetch cat fact from API
async function getCatFact() {
  const response = await fetch("https://catfact.ninja/fact");
  const data = await response.json();
  console.log(data.fact);
  return data.fact;
}

// Create server
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/me" && req.method === "GET") {
    try {
      // Fetch cat fact
      const catFact = await getCatFact();

      // Prepare user data
      const userData = {
        status: "success",
        user: {
          email: "emmanuelyahi12@gmail.com",
          name: "Emmanuel Yahi",
          stack: "Node.js, Express (framework), REST API",
        },
        timestamp: new Date().toISOString(),
        fact: catFact,
        
      };

      res.writeHead(200);
      res.end(JSON.stringify(userData, null, 2));
    } catch (error) {
      res.writeHead(500);
      res.end(
        JSON.stringify({
          error: "Failed to fetch cat fact",
          message: error.message,
        })
      );
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Try: http://localhost:${PORT}/me`);
});

