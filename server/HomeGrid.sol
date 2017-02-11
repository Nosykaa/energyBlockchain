pragma solidity ^0.4.2;

contract HomeGrid {
    
    struct Prosumer{
        address box;
        address home;
        string psysicalAddress;
        bool available;
        uint sellPrice;
        uint buyPrice;
        bytes32 chargingContractListHash;
    }
    
    struct Consumer{
        address home;
        string psysicalAddress;
        bool available;
        uint buyPrice;
        bytes32 chargingContractListHash;
    }

    mapping(address => uint) prosumersPosition;
    mapping(address => uint) consumersPosition;


    mapping(address => uint) prosumersBoxPosition;
    mapping(address => uint) consumersBoxPosition;
    
    Prosumer[] prosumers;
    Consumer[] consumers;
    uint prosumersLength;
    uint consumersLength;
    
    /**
     * This event is used for standard change notification messages and outputs the following:
     * - event function sender
     * - event status level
     * - event message body
     */
    event ChangeNotification(address indexed sender, uint status, string notificationMsg);

    /**
     * This function is used to send events.
     * Status Level Scale:
     *  1   Error: error conditions
     *  2   Warning: warning conditions
     *  3   Significant Change: Significant change to condition
     *  4   Informational: informational messages
     *  5   Verbose: debug-level messages
     */
    function sendEvent(address _sender, uint _status, string _notification) internal returns(bool) {
        ChangeNotification(_sender, _status, _notification);
        return true;
    }
    
    function HomeGrid(){
        prosumers.push(Prosumer(0, 0, "0", false, 0, 0));
        consumers.push(Consumer(0, "0", false, 0));
        prosumersLength=prosumers.length;
        consumersLength=consumers.length;
    }
    
    function addProsumers(address box,string psysicalAddress, bool available, uint sellPrice, uint buyPrice, bytes32 chargingContractListHash) { 
       prosumers.push(Prosumer(box, msg.sender, psysicalAddress, available, sellPrice, buyPrice, chargingContractListHash));
       prosumersPosition[msg.sender] = prosumersLength;
       prosumersBoxPosition[box] = prosumersLength;
       prosumersLength= prosumers.length;
       sendEvent(msg.sender, 4, "This prosumer home is now created");
    }
    
    function addConsumers(string psysicalAddress, bool available, uint buyPrice, bytes32 chargingContractListHash) { 
       consumers.push(Consumer(msg.sender, psysicalAddress, available, buyPrice, chargingContractListHash));
       consumersPosition[msg.sender] = consumersLength;
       consumersBoxPosition[box] = consumersLength;
       consumersLength = consumers.length;
       sendEvent(msg.sender, 4, "This consumer home is now created");
    }
    
    function updateHome(uint sellPrice, uint buyPrice, bool available, bool isProsumer, bytes32 chargingContractListHash) {
        uint pos;
        if (isProsumer){
            pos = prosumersPosition[msg.sender];
            if (msg.sender == prosumers[pos].home && pos != 0) {
                prosumers[pos].available = available;
                prosumers[pos].sellPrice = sellPrice;
                prosumers[pos].buyPrice = buyPrice;
                prosumers[pos].chargingContractListHash = chargingContractListHash;                
                sendEvent(msg.sender, 4, "This prosumer home is now updated");
            } else {
                sendEvent(msg.sender, 1, "This wallet is not the owner of the prosumer house");
            }
        } else {
            pos = consumersPosition[msg.sender];
             if (msg.sender == prosumers[pos].home && pos != 0) {
                consumers[pos].available = available;
                consumers[pos].buyPrice = buyPrice;
                consumers[pos].chargingContractListHash = chargingContractListHash;
                sendEvent(msg.sender, 4, "This consumer home is now updated");
            } else {
                sendEvent(msg.sender, 1, "This wallet is not the owner of the consumer house");
            }
        }
    }

    function getProsumer(address home) constant returns(address, address, string, bool, uint, uint, bytes32){
        uint pos = prosumersPosition[home];
        return (prosumers[pos].box,  prosumers[pos].home,  prosumers[pos].psysicalAddress,  prosumers[pos].available, prosumers[pos].sellPrice, prosumers[pos].buyPrice, prosumers[pos].chargingContractListHash);
    }

    function getConsumer(address home) constant returns(address, string, bool, uint, bytes32){
        uint pos = consumersPosition[home];
        return (consumers[pos].home,  consumers[pos].psysicalAddress,  consumers[pos].available, consumers[pos].buyPrice, consumers[pos].chargingContractListHash);
    }

    function getProsumerByBox(address box) constant returns(address, address, string, bool, uint, uint, bytes32){
        uint pos = prosumersBoxPosition[box];
        return (prosumers[pos].box,  prosumers[pos].home,  prosumers[pos].psysicalAddress,  prosumers[pos].available, prosumers[pos].sellPrice, prosumers[pos].buyPrice, prosumers[pos].chargingContractListHash);
    }

    function getConsumerByBox(address box) constant returns(address, string, bool, uint, bytes32){
        uint pos = consumersBoxPosition[home];
        return (consumers[pos].home,  consumers[pos].psysicalAddress,  consumers[pos].available, consumers[pos].buyPrice, consumers[pos].chargingContractListHash);
    }
}
