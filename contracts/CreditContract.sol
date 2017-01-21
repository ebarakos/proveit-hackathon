pragma solidity ^0.4.8;

import './Bill.sol';

contract CreditContract {

	mapping (address => uint) public credits;
	mapping (address => mapping( uint => address )) public bills;
    mapping (address => uint) public bills_count;
    mapping (address => mapping(uint => address)) public outgoing_bills;
    mapping (address => uint) public outgoing_bills_count;
    
    function CreditContract(){}

    function AddBill(address _chargee, uint _amount, uint _end) returns (address bill){
    	address new_bill = new Bill(_chargee, msg.sender, _amount, _end);
    	bills[_chargee][bills_count[_chargee]] = new_bill;
    	bills_count[_chargee] += 1;
    	outgoing_bills[msg.sender][outgoing_bills_count[msg.sender]] = new_bill;
    	outgoing_bills_count[msg.sender] += 1;
    	return new_bill;
    }

    function AcceptBill(address chargee) returns (bool success){
    	credits[chargee] -= 5;
    	return true;
    }

    function PayBill(address chargee){
    	uint credit = 6;
    	if (now > Bill(msg.sender).end()) credit = 4;
    	credits[chargee] += credit;
    }
}
