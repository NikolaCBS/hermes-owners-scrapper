import { readFileSync } from "fs";

const calculateHermes = () => {
    let total = BigInt(0);

    const hermesHolders = readFileSync("hermes_owners.csv", "utf-8")
        .split("\n")
        .splice(1);

    hermesHolders.forEach((owner) => {
        const amount: string = owner.split(",")[4];

        if (amount) {
            total += BigInt(amount);
        }
    });

    total = total / BigInt(Math.pow(10, 18));

    console.log(`Total HMX in circulation: ${total.toString()}`);
};

calculateHermes();
