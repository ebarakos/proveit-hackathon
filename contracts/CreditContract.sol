pragma solidity ^0.4.8;

contract CreditContract {

	mapping (address => uint) public credits;
	mapping (address => mapping( uint => address )) public bills;
    mapping (address => uint) public billsCount;
    mapping (address => mapping(uint => address)) public outgoingBills;
    mapping (address => uint) public outgoingBillsCount;
    
    function CreditContract() {
	}

    function AddBill(address _chargee, uint _amount, uint _end) returns (address bill){
    	address newBill = new Bill(_chargee, msg.sender, _amount, _end);
    	bills[_chargee][bills_count[_chargee]] = newBill;
    	billsCount[_chargee] += 1;

    	outgoingBills[msg.sender][outgoingBillsCount[msg.sender]] = newBill;
    	outgoingBills_count[msg.sender] += 1;
    	
    	return newBill;
    }

    function AcceptBill(address chargee) returns(bool success){
    	credits[chargee] -= 5;
    	return true;
    }
    function PayBill(address chargee){
    	uint credit = 6;
    	if (now > Bill(msg.sender).end()) credit = 4;
    	credits[chargee] += credit;
    }
}

contract Bill{
    
	address public charger;
	address public chargee;
	uint public amount;
	uint public end;
	bool public accepted;
	bool public paid;
	CreditContract public creditContract;

	
	function Bill(address _chargee, address _charger, uint _amount, uint _end) {
		end = _end;
		charger = _charger;
		chargee = _chargee;
		amount = _amount;
		accepted = false;
		paid=false;
		creditContract = CreditContract(msg.sender);
	}

	function Accept() returns(bool success){

		if (now > end) return false;
		if (msg.sender != chargee) return false;
		accepted = true;
		creditContract.AcceptBill(msg.sender);
		return true;
	}
















































































































































































































    ............
    
	function Pay() payable returns(bool success){
		if (msg.sender != chargee) return false;
		if (msg.value < amount) return false;
		if (!charger.send(msg.value)) return false;
		if(msg.value>amount) chargee.send(msg.value-amount);
		paid = true;
		creditContract.PayBill(msg.sender);
		
		return true;
	}
}