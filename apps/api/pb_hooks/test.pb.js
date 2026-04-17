// const Redis = require(`${__hooks}/../node_modules/ioredis`);

// const client = new Redis(
//     "rediss://default:********@eu2-magical-doberman-31273.upstash.io:31273"
// );

routerAdd("GET", "/api/hello/test", async (c) => {
    // let data = await client.get("brands");
    // if (data) {
    //     return c.json(200, { msg: data });
    // }

    const record = $app
        .dao()
        .findRecordsByFilter("brands", "id != null", "-created", 500, 0, {
            fields: "collectionId",
        });
    return c.json(200, { msg: record });
});
