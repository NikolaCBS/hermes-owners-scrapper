import { readFileSync } from "fs";

const calculateHermes = () => {
    let total = 0;

    const hermesHolders = readFileSync("hermes_owners.csv", "utf-8")
        .split("\n")
        .splice(1);

    hermesHolders.forEach((owner) => {
        const amount = owner.split(",")[1];

        if (!isNaN(+amount)) {
            total += +amount;
        }
    });

    console.log(`Total HMX in circulation: ${total}`);
};

calculateHermes();
