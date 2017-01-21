	pragma solidity ^0.4.8;

import './Bill.sol';

contract CreditContract {

	mapping (address => int) public credits;
	mapping (address => mapping( uint => address )) public bills;
    mapping (address => uint) public billsCount;
    mapping (address => mapping(uint => address)) public outgoingBills;
    mapping (address => uint) public outgoingBillsCount;
    int private range; 
    int private maxReturn;
    int private acceptPrice;
    int private maxDays;
    
    function CreditContract(){
        range = 1000000;
        maxReturn = 100;
        acceptPrice = 50;
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
    	credits[chargee] -= acceptPrice;
        checkRange(chargee);
    	return true;
    }

    function PayBill(address chargee, address charger, uint end) {
    	if (now > end){

    		credits[chargee] += calculateLateReturn(int(now - end), credits[chargee] - credits[charger]);
        }else{
            credits[chargee] += calculatePossitiveCredits(credits[chargee] - credits[charger]);
            credits[chargee] += acceptPrice;
        }

        checkRange(chargee);
    }
    function checkRange(address chargee){
        if (credits[chargee] >= range) {
            credits[chargee] = range;
        }
        if (credits[chargee] <= -range){
            credits[chargee] = -range;
        }
    }

    function calculatePossitiveCredits(int difference) returns (int possitiveCredits){
        return maxReturn / 2 - difference * maxReturn / 4 /range;
    }

    function calculateLateReturn(int delay, int difference) returns (int lateReturnCredits){
        return calculatePossitiveCredits(difference) * (maxDays - delay/1 days)/maxDays; 
    }

 
}
