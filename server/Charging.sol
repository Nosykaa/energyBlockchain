pragma solidity ^0.4.2;

contract Charging {

   //Wallet of the box
   address private box;
   //Wallet of the home owner
   address private home;
   //Wallet of the electric car owner
   address private carOwner;
   //Starting meter reading
   uint private startMeterReading;
   //The price at the time of sale
   uint private sellPrice;
   //Ending meter reading
   uint private endMeterReading;

   //Payment status to prevent duplicate calls
   bool public paymentInProgress;
   //Payment completion status to the home owner
   bool public homePaid;
   //Payment completion status to the box
   bool public boxPaid;
   //Status of unused amount settlement
   bool public settlementInProgress;

   //Charging Status
   enum State {Created, ChargingStarted, ChargeCompleted, Finished}
   State public state;

   string public version = "0.1";

   /**
    * This event is used for standard change notification messages and outputs the following:
    * - event status level
    * - event message body
    */
   event ChargingNotification(uint status, string notificationMsg);

   /**
    * This function is used to send events.
    * Status Level Scale:
    *  1   Error: error conditions
    *  2   Warning: warning conditions
    *  3   Significant Change: Significant change to condition
    *  4   Informational: informational messages
    *  5   Verbose: debug-level messages
    */
   function sendEvent(uint _status, string _notification) internal returns(bool) {
       ChargingNotification(_status, _notification);
       return true;
   }

   // Modifier for only the box to be able to execute some functions
   modifier onlyBox() {
       if (msg.sender != box) throw;
       _;
   }

   // Modifier for only the car owner to be able to execute some functions
   modifier onlyCarOwner() {
       if (msg.sender != carOwner) throw;
       _;
   }

   // Modifier for only certain state to be able to execute some functions
   modifier inState(State _state) {
       if (state != _state) throw;
       _;
   }

   //Contract creation
   function Charging(address _home, address _carOwner, uint _sellPrice, uint _startMeterReading) {
      box = msg.sender;
      home = _home;
      carOwner = _carOwner;
      sellPrice = _sellPrice;
      startMeterReading = _startMeterReading;
      state = State.Created;
   }

   //Charge started
   function chargeStarted() payable onlyCarOwner inState(State.Created) {
     state = State.ChargingStarted;
     sendEvent(1, "Charging Started");
   }

   //Charge completed. Settle payments
   function chargeCompleted(uint _endMeterReading) onlyBox inState(State.ChargingStarted) {
    endMeterReading = _endMeterReading;
    if(endMeterReading <= startMeterReading) {
      throw;
    }
    state = State.ChargeCompleted;
    makeEnergyUsePayments();
    refundUnusedAmount();
   }

   //Compute and Make payments
   function makeEnergyUsePayments() inState(State.ChargeCompleted) {
     uint energyConsumed = endMeterReading - startMeterReading;
     uint totalCost = energyConsumed * sellPrice;
     uint homePayment = (totalCost * 70)/100;
     uint boxPayment = (totalCost * 30)/100;
     if(paymentInProgress) {
       sendEvent(1, "Payment is already in progress");
     } else {
       paymentInProgress = true;
       if(!homePaid) {
         if (!home.send(homePayment)){
           paymentInProgress = false;
           throw;
         } else {
           homePaid = true;
           if(!boxPaid) {
             if (!box.send(boxPayment)){
               paymentInProgress = false;
               throw;
             } else {
               boxPaid = true;
               paymentInProgress = false;
             }
           }
         }
       } else {
         if(!boxPaid) {
           if (!box.send(boxPayment)){
             paymentInProgress = false;
             throw;
           } else {
             boxPaid = true;
             paymentInProgress = false;
           }
         }
       }
      sendEvent(4, "Payments to Home and Box successfully completed");
    }
  }

  //Refund unsettled amout to the car owner
  function refundUnusedAmount() inState(State.ChargeCompleted) {
    if(settlementInProgress) {
      sendEvent(1, "Unused amount settlement is already in progress");
    } else {
      settlementInProgress = true;
      if (homePaid && boxPaid) {
          if(!carOwner.send(this.balance)) {
            settlementInProgress = false;
            throw;
          } else {
            settlementInProgress = false;
            sendEvent(4, "Unused amount settled to the Car Owner");
            state = State.Finished;
          }
      } else {
          sendEvent(1, "Home and Box Payment not completed");
      }
    }
  }
}
