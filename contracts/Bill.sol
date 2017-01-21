pragma solidity ^0.4.8;

contract CreditContractInterface{
	function AcceptBill(address chargee) returns (bool success);
	function PayBill(address chargee, address charger, uint end);
}

contract Bill{
    
	address public charger;
	address public chargee;
	uint public amount;
	uint public end;
	bool public accepted;
	bool public paid;
	CreditContractInterface public creditContract;

	function Bill(address _chargee, address _charger, uint _amount, uint _end){
		end = _end;
		charger = _charger;
		chargee = _chargee;
		amount = _amount;
		accepted = false;
		paid=false;
		creditContract = CreditContractInterface(msg.sender);
	}

	function Accept() returns (bool success){
		if (accepted || paid) return false;
		if (now > end) return false;
		if (msg.sender != chargee) return false;
		accepted = true;
		creditContract.AcceptBill(msg.sender);
		return true;
	}

	function Pay() payable returns (bool success){
		if (msg.sender != chargee) return false;
		if (msg.value < amount) return false;
		if (!charger.send(msg.value)) return false;
		if (!accepted || paid) return false;
		if(msg.value>amount && !chargee.send(msg.value-amount)) return false;
		paid = true;
		creditContract.PayBill(msg.sender, charger, end);
		return true;
	}
}