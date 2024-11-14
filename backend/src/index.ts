import client from "./controller/client.js";
// const server = express();

// server.use(express.json());

// server.listen(process.env.PORT_SERVER, () => console.log("pai ta on"));

// await client.create({
//   name: "Lucas",
//   phone: "40028922",
//   totalPurchase: 3,
// });


console.log(await client.search("Lucas"));
