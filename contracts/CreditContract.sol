	pragma solidity ^0.4.8;

import './Bill.sol';

contract CreditContract {

	mapping (address => int) public credits;
	mapping (address => mapping( uint => address )) public bills;
    mapping (address => uint) public billsCount;
    mapping (address => mapping(uint => address)) public outgoingBills;
    mapping (address => uint) public outgoingBillsCount;
    int private range; 
    
    function CreditContract(){
	}

    function AddBill(address _chargee, uint _amount, uint _end) returns (address bill){
    	address newBill = new Bill(_chargee, msg.sender, _amount, _end);
    	bills[_chargee][billsCount[_chargee]] = newBill;
    	billsCount[_chargee] += 1;

    	outgoingBills[msg.sender][outgoingBillsCount[msg.sender]] = newBill;
    	outgoingBillsCount[msg.sender] += 1;
    	
    	return newBill;
    }

    function AcceptBill(address chargee) returns(bool success){
    	credits[chargee] -= calculateCredits(chargee) / 2;
    	return true;
    }

    function PayBill(address chargee) {
    	if (now > Bill(msg.sender).end())
    		credits[chargee] += calculateNegativeCredits(int(now - Bill(msg.sender).end()), credits[chargee]);
    	else
    		int creditOfReciever = credits[Bill(msg.sender).charger()];    	

    		credits[chargee] += calculate(credits[chargee], creditOfReciever);
    }

    function calculateNegativeCredits(int howLate, int prevValue) returns(int) {
    	int numberOfDaysDelayed = howLate / 1 days;
    	return prevValue - ((1 - 1 / (1 + numberOfDaysDelayed)) / 10);
    }

    function calculateCredits(address chargee) returns(int) {

    	int chargeeCredit = credits[Bill(msg.sender).charger()];

    	int prevCredit = credits[Bill(msg.sender).chargee()];

    	return calculate(prevCredit, chargeeCredit);
    }

    function calculate(int prevValue, int creditOfOpponent) returns(int) {
    	return range - range / (1 + creditOfOpponent);
    }

}
