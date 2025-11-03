// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Subscription {
    address public owner;

    enum Plan { Basic, Premium, Cinematic }

    struct Sub {
        uint256 expiresAt;
        Plan plan;
        bool active;
    }

    mapping(address => Sub) public subscriptions;
    mapping(Plan => uint256) public prices; // in wei

    event Subscribed(address indexed user, Plan plan, uint256 expiresAt);
    event Cancelled(address indexed user);
    event PriceUpdated(Plan plan, uint256 price);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor(uint256 basicPrice, uint256 premiumPrice, uint256 cinematicPrice) {
        owner = msg.sender;
        prices[Plan.Basic] = basicPrice;
        prices[Plan.Premium] = premiumPrice;
        prices[Plan.Cinematic] = cinematicPrice;
    }

    function buyPlan(Plan plan, uint256 months) external payable {
        require(months > 0, "months>0");
        uint256 price = prices[plan] * months;
        require(msg.value >= price, "insufficient payment");

        uint256 additional = months * 30 days; // đơn giản: 30 ngày = 1 tháng
        uint256 newExpiry = block.timestamp;
        if (subscriptions[msg.sender].active && subscriptions[msg.sender].expiresAt > block.timestamp) {
            newExpiry = subscriptions[msg.sender].expiresAt + additional;
        } else {
            newExpiry = block.timestamp + additional;
        }

        subscriptions[msg.sender] = Sub({
            expiresAt: newExpiry,
            plan: plan,
            active: true
        });

        // refund excessive
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        emit Subscribed(msg.sender, plan, newExpiry);
    }

    function cancel() external {
        subscriptions[msg.sender].active = false;
        emit Cancelled(msg.sender);
    }

    function updatePrice(Plan plan, uint256 newPrice) external onlyOwner {
        prices[plan] = newPrice;
        emit PriceUpdated(plan, newPrice);
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function getSubscription(address user) external view returns (bool active, uint256 expiresAt, Plan plan) {
        Sub memory s = subscriptions[user];
        bool isActive = s.active && s.expiresAt > block.timestamp;
        return (isActive, s.expiresAt, s.plan);
    }
}
