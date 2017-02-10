pragma solidity ^0.4.2;

contract Subscribe {

   address private contributor;
   address public fund;
   address public digitalIDAddress;

   address public validator;
   address public riskProvider;
   address public checkListProvider;

   string public validatorAPIURL;
   string public riskProviderAPIURL;
   string public checkListProviderAPIURL;
   string public fundAPIURL;

   string private categoryFund;
   string public fundRequirement;
   string private fundName;

   string private riskProfilContributor;
   string public checkListTodo;
   string public checkResultDone;
   string public fundRequestDone;

   enum State {Created, Signed, RiskAdded, CriteriaAdded, Validated, Aborted, Locked, Cancel}
   State public state;

   string public version = "0.1";

   event validateEvent(uint res);
   event Debug(uint res);
   event RiskRequest(string riskProviderAPIURL, address digitalIDAddress);
   event CriteriaRequest(string _checkListProviderAPIURL, address digitalIDAddress, string riskProfilContributor, string categoryFund);
   event ResultCriteriaRequest(string _validatorAPIURL, address digitalIDAddress);
   event ValidationRequest(string _fundAPIURL, address digitalIDAddress);
   event UpdateBalance(string functionName, address sender, uint amount, bool isASender);

   modifier onlyContributor() {
       if (msg.sender != contributor) throw;
       _;
   }

   modifier onlyRiskProvider() {
       if (msg.sender != riskProvider) throw;
       _;
   }

   modifier onlyValidator() {
       if (msg.sender != validator) throw;
       _;
   }

   modifier onlyCheckListProvider() {
       if (msg.sender != checkListProvider) throw;
       _;
   }

   modifier onlyFund() {
       if (msg.sender != fund) throw;
       _;
   }

   modifier inState(State _state) {
       if (state != _state) throw;
       _;
   }


    modifier costs(uint _amount) {
        if (msg.value < _amount)
            throw;
        _;
        if (msg.value >= _amount)
            msg.sender.send(msg.value - _amount);
    }

   function Subscribe(address _contributor, address _digitalIDAddress, string _categoryFund, string _fundName, string _fundRequirement) {
       contributor = _contributor;
       fund = msg.sender;
       digitalIDAddress = _digitalIDAddress;
       categoryFund = _categoryFund;
       fundName = _fundName;
       fundRequirement = _fundRequirement;
       state = State.Created;
   }

   function addValidators(string _validatorAPIURL, string _riskProviderAPIURL, string _checkListProviderAPIURL,  address _validator, address _riskProvider, address _checkListProvider, string _fundAPIURL) payable costs(30 ether) onlyFund {
        validatorAPIURL = _validatorAPIURL;
        riskProviderAPIURL = _riskProviderAPIURL;
        checkListProviderAPIURL = _checkListProviderAPIURL;
        validator = _validator;
        riskProvider = _riskProvider;
        checkListProvider = _checkListProvider;
        fundAPIURL = _fundAPIURL;
        UpdateBalance("addValidators", msg.sender, 30000000000000000000, true);
        Debug(1);
   }

   function confirmSuscription() onlyContributor inState(State.Created) {
       state = State.Signed;
       RiskRequest(riskProviderAPIURL, digitalIDAddress);
   }

   function setRisk(string _riskProfilContributor) onlyRiskProvider inState(State.Signed) {
       state = State.RiskAdded;
       riskProfilContributor = _riskProfilContributor;
       if (!msg.sender.send(5000000000000000000)){
        throw;
       } else {        
        CriteriaRequest(checkListProviderAPIURL, digitalIDAddress, riskProfilContributor, categoryFund);
        UpdateBalance("setRisk", msg.sender, 5000000000000000000, false);
       }
   }

   function setCriteriaList(string _checkListTodo) onlyCheckListProvider inState(State.RiskAdded){
       checkListTodo = _checkListTodo;
       state = State.CriteriaAdded;
       if (!msg.sender.send(10000000000000000000)){
        throw;
       } else {
        ResultCriteriaRequest(validatorAPIURL, digitalIDAddress);
        UpdateBalance("setCriteriaList", msg.sender, 10000000000000000000, false);
       }
   }

   function setResultCriteriaRequest(string _checkResultDone, string _fundRequestDone) onlyValidator inState(State.CriteriaAdded){
       checkResultDone = _checkResultDone;
       fundRequestDone = _fundRequestDone;
       state = State.Locked;
       if (!msg.sender.send(15000000000000000000)){
        throw;
       } else {
        ValidationRequest(fundAPIURL, digitalIDAddress);
        UpdateBalance("setResultCriteriaRequest", msg.sender, 15000000000000000000, false);
       }
   }

   function setValidation(bool isAutorised) onlyFund  inState(State.Locked){
       if (isAutorised) {
            state = State.Validated;
       } else {
            state = State.Aborted;
       }
   }

   function cancel() onlyFund {
       if (!msg.sender.send(this.balance)){
        throw;
       } else {
        state = State.Cancel;
        UpdateBalance("setResultCriteriaRequest", msg.sender, this.balance, false);
       }
       
   }

}
