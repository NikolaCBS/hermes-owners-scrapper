interface hermesHolder {
    user_address: string;
    balance_amount: string;
    staking_amount: string;
    rewards_amount: string;
    hermes_total: string;
}

interface stakingInfo {
    stacking: string;
    rewards: string;
}

interface hermesUserTotal {
    user_address: string;
    hermes_total: string;
}

export { hermesHolder, stakingInfo, hermesUserTotal };
