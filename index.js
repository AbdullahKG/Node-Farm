const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////////////
// Blocking Synchronous Code for file

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `this is what we know aboute the avocado ${textIn}. \nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("file written");

// non-blocking Asynchronous Code for file

// fs.readFile("./txt/start.txt", "utf-8", (err, data) => console.log(data));
// console.log("Reading a File ...");

////////////////////////////
// Creating simple web server
// const server = http.createServer((req, res) => {
//   res.end("Hello from the server!");
// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("Listening to request on port 8000");
// });

////////////////////////////////
// Routing

// const server = http.createServer((req, res) => {
//   const pathName = req.url;
//   if (pathName === "/" || pathName === "/overview") {
//     res.end("this is the overview");
//   } else if (pathName === "/Product") {
//     res.end("this is the Product");
//   } else {
//     res.writeHead(404, {
//       "Content-type": "txt/html",
//     });
//     res.end("<h1>Page not found!</h1>");
//   }

// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("Listening to request on port 8000");
// });

///////////////////////////////////////
// Creating Simple API

// const data = fs.readFileSync("./dev-data/data.json", "utf-8");
// const dataObj = JSON.parse(data);

// const server = http.createServer((req, res) => {
//   const pathName = req.url;

//   if (pathName === "/" || pathName === "/overview") {
//     res.end("this is the overview");
//   } else if (pathName === "/Product") {
//     res.end("this is the Product");
//   } else if (pathName === "/api") {
//     res.writeHead(200, { "Content-type": "application/json" });
//     res.end(data);
//   } else {
//     res.writeHead(404, {
//       "Content-type": "txt/html",
//     });
//     res.end("<h1>Page not found!</h1>");
//   }
// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("Listening to request on port 8000");
// });

//////////////////////////////////////
// HTML Templaiting : building the template
// HTML Templaiting : Filling the template
// parsing variables from url
// our own module

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product Page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // error
  } else {
    res.writeHead(404, {
      'Content-type': 'txt/html',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
