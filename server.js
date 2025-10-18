const http = require("http");

const PORT = 3000;


//using static ip for tests
const users = {
  "192.168.10.5": {
    lastDate: new Date(),
    count: 0,
  },
};

function rateLimit(ip, res) {
  const userData = users[ip];
  console.log("logging user data >>>>", userData);
  console.log('loggin current dates >>>> ', new Date())
  const afterOneMinute = new Date(new Date(userData.lastDate).getTime() + 1 * 60 * 1000)

  if (
    new Date() < afterOneMinute &&
    userData.count < 5
  ) {
    console.log("second if");
    userData.count += 1;
    userData.lastDate = new Date();
    return { status: true, message: "" };
  } else if (
    new Date() < afterOneMinute &&
    userData.count >= 5
  ) {
    console.log("third if");
    return {
      status: false,
      message:
        "too many requests, Cannot make more than 5 requests in a minute",
    };
  } else if (new Date() > afterOneMinute) {
    console.log("first if");
    userData.count = 1;
    userData.lastDate = new Date();
    return { status: true, message: "" };
  }
  return { status: true, message: "" };
}

// Function to fetch cat fact from API
async function getCatFact() {
  const response = await fetch("https://catfact.ninja/fact");
  const data = await response.json();
  return data.fact;
}

// Create server
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/me" && req.method === "GET") {
    console.log('logging the request >>>> ', req)
   const {status, message} =  rateLimit("192.168.10.5", res);
   if (!status) {
     res.writeHead(429);
     res.end(
       JSON.stringify({
         message:
           "too many requests, Cannot make more than 5 requests in a minute",
       })
     );
     return
   }
    try {
      // Fetch cat fact
      const catFact = await getCatFact();

      // Prepare user data
      const userData = {
        status: "success",
        user: {
          email: "emmanuelyahi12@gmail.com",
          name: "Emmanuel Yahi",
          stack: "Node.js, REST API",
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
