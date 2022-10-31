$(document).ready(function(){

  var minContractPay = 25;
  var minPayInterest = 0;
  var minPayTime = 0;
  var calcTimeout;

  var calculateDetails = function(calcBalance, apr, calcRepayment) {
    var aprPerDay = apr / 365;
    var daysPerMonth = 365 / 12;
    var interest = Math.floor(calcBalance * aprPerDay * daysPerMonth * 100) / 100;
    calcBalance = calcBalance + interest;
    var month = 0;
    var initRepayment = calcRepayment;
    var totalInterest = 0;
    while (calcBalance > 0) {
        month++;
        totalInterest += interest;
        calcRepayment = (0.01 * calcBalance) + interest;
        if (calcRepayment < initRepayment) {
            calcRepayment = initRepayment;
        }
        interest = Math.floor(((calcBalance * aprPerDay * daysPerMonth) - (calcRepayment * aprPerDay * (daysPerMonth - 20))) * 100) / 100;
        calcBalance = calcBalance + interest - calcRepayment;
    }
    totalInterest = (Math.round(totalInterest * Math.pow(10, 8))) / Math.pow(10, 8);
    var result = {
        years: Math.floor(month / 12),
        months: month % 12,
        interest: Math.floor(totalInterest * 100) / 100
    };
    return result;
  }

  var fillTime = function(years, months, hasLineBreak) {
    var timeS = "";
    if (years > 0) {
        timeS += years;
        if (years == 1) {
            timeS += " year";
        } else {
            timeS += " years";
        }
        if (months > 0) {
            if (hasLineBreak) {
                timeS += "<br>";
            } else {
                timeS += ", "
            }
        }
    }
    if (months > 0) {
        timeS += months;
        if (months == 1) {
            timeS += " month";
        } else {
            timeS += " months";
        }
    }
    return timeS;
  }

  // Calculate contractual minimum payment
  var calcMinPayment = function(balance, apr) {
    var initBalance = balance;
    var aprPerDay = apr / 365;
    var daysPerMonth = 365 / 12;
    var initInterest = Math.floor(initBalance * aprPerDay * daysPerMonth * 100) / 100;
    balance += initInterest;
    return Math.max(Math.ceil((0.01 * balance) + initInterest), 25);
  }

  // Update values
  var updateResults = function(){

    
    var balance = parseFloat($('#balance').val());
    var apr = parseFloat($('#rate').val());
    //var initRepayment = 25;
    

    var calculationResult = calculateDetails(balance, apr, minContractPay);
    var years = calculationResult.years;
    var months = calculationResult.months;
    var interest = calculationResult.interest;

    // Not sure what this is for?
    minPayTime = (years * 12) + months;
    minPayInterest = interest;

    // Update Estimated time to repay
    $("#time-to-repay").html(fillTime(years, months, false));

    // Update Total estimated interest paid
    $("#paid-in-interest").html("£" + Math.ceil(interest).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    
    // Update monthly input field TODO
    var minPayment = calcMinPayment(balance, apr);
    $('#monthly').attr('min',minPayment);

    if($('#monthly').val() < minPayment+20)
      $('#monthly').val(minPayment+20);
  }
  updateResults();

  var updateIncreaseResults = function(){

    // Estimated time to repay (increase)

    // Total estimated interest paid (incread)

    // By increasing your monthly payments you could
    
    var balance = parseFloat($('#balance').val());
    var apr = parseFloat($('#rate').val());
    var initRepayment = parseFloat($('#monthly').val());

    var calculationResult = calculateDetails(balance, apr, initRepayment);

    var adjustedInterest = Math.ceil(calculationResult.interest);
    
    $("#adjTimeToRepay").html(fillTime(calculationResult.years, calculationResult.months, false));

    var adjInterestS = Math.ceil(adjustedInterest).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $("#adjInterest").html("£"+adjInterestS);

    
    var adjustedTime = (calculationResult.years * 12) + calculationResult.months;
    
    var savingLengthS = minPayTime - adjustedTime;
    savingLengthS = fillTime(Math.floor(savingLengthS / 12), savingLengthS % 12, false);
    $("#saving-length").html(savingLengthS);
    
    
    
    var savings = Math.ceil(minPayInterest) - Math.ceil(adjustedInterest);
    if (savings == 0) {
      $("#interest-saving").html("Pay less interest");
    } else {
      $("#interest-saving").html("Save £" + Math.round(savings).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " in interest paid.");
    }
  }

  // Event handlers
  $('body').on('change keyup','#payment-calculator #balance, #payment-calculator #rate', function() {
    
    clearTimeout(calcTimeout);
    calcTimeout = setTimeout(function(){ 

      if($('#payment-calculator .form-group--error').length == 0)
        updateResults();
        updateIncreaseResults();
    }, 300);
  });

  $('body').on('change keyup','#payment-calculator #monthly', function() {
    
    clearTimeout(calcTimeout);
    calcTimeout = setTimeout(function(){ 

      if($('#payment-calculator .form-group--error').length == 0)
        updateIncreaseResults();
    }, 300);
  });

  var stepperEvent = 'click';
  if ("ontouchstart" in document.documentElement){
    stepperEvent = 'touchstart';
  }

  $('body').on(stepperEvent,'#payment-calculator .stepper__plus, #payment-calculator .stepper__minus', function() {
    
    clearTimeout(calcTimeout);
    calcTimeout = setTimeout(function(){ 

      if($('#payment-calculator .form-group--error').length == 0)
        updateIncreaseResults();
    }, 300);
  });
});