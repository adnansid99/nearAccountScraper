const axios = require("axios");
const fs = require("fs");

let arr = JSON.parse(fs.readFileSync("names.json"));
if (fs.existsSync("availableNear.json")) {
    nearData = JSON.parse(fs.readFileSync("availableNear.json"));
} else {
    nearData = [];
}

const colorCode = {
    red: "\x1b[31m%s\x1b[0m",
    green: "\x1b[32m%s\x1b[0m",
};

const getData = async (acc_id) => {
    await axios
        .post("https://rpc.mainnet.near.org/", {
            id: 0,
            jsonrpc: "2.0",
            method: "query",
            params: {
                request_type: "view_account",
                account_id: acc_id + ".near",
                finality: "optimistic",
            },
        })
        .then((res) => {
            if (res.data.error) {
                nearData.push(res.data.error.cause.info.requested_account_id);
                fs.writeFileSync(
                    "availableNear.json",
                    JSON.stringify(nearData),
                    (err) => {
                        if (err) {
                            console.log("ERROR: ", err);
                        }
                    }
                );

                console.log(
                    colorCode.green,
                    res.data.error.cause.info.requested_account_id +
                        " is available"
                );
            } else {
                console.log(
                    colorCode.red,
                    acc_id + ".near" + " is not available"
                );
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

const start = async () => {
    for (let i = 0; i < arr.length; i++) {
        await getData(arr[i]);
    }
    console.log("\nAvailable names are saved in 'availableNear.json' file\n");
};

start();
