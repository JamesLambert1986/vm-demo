$(document).ready(function () {
    function CalculateSavingsMiles(){
        //define variables 
        var oldReward = document.querySelectorAll('[data-min-value]')[0];
        var newReward ;
        var defaultSpend = 650;
        var minSpend =1;
        var maxSpend = 1000000;
        var regex = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/;
        var isValid = true;
        var spend = $('#monthly_spend').val();

        if(regex.test(spend)){
            spend = spend.replace(/,/g,'');
        } else {
            $('#vaaCalcError').text('Please enter a valid amount between £1 and £1,000,000');
            $('#vaaCalcError').removeClass('visually-hidden');
            $('#monthly_spend').addClass('error--field');
            isValid = false;		
        }

        var spend = parseFloat(spend);

        if (spend < minSpend || spend > maxSpend){
            $('#vaaCalcError').text('Please enter a valid amount between  £'+addCommas(minSpend)+' and £'+addCommas(maxSpend));
            $('#vaaCalcError').removeClass('visually-hidden');
            $('#monthly_spend').addClass('error--field');
            isValid = false;
        }

        if (isValid) {
            $('#vaaCalcError').addClass('visually-hidden');
            $('#monthly_spend').removeClass('error--field');
            if (spend % 1 != 0) {
                spend = parseFloat(spend).toFixed(2);
            }

            var allRewards = document.querySelectorAll('[data-min-value]');
            var annualSpend;

            annualSpend  = spend 

            var rewardChanged = false;
            for (var rewardResult in allRewards) {
                if (allRewards.hasOwnProperty(rewardResult) && allRewards[rewardResult] != oldReward){
                    var min = parseInt(allRewards[rewardResult].getAttribute('data-min-value'));
                    var max = parseInt(allRewards[rewardResult].getAttribute('data-max-value'));
                    if (annualSpend >= min && annualSpend <= max)
                    {
                        newReward = allRewards[rewardResult];
                                    rewardChanged = true;
                    }
                }
            }

            if (rewardChanged) {
                $(oldReward).fadeOut(500, function() {
                    $(newReward).fadeIn(500);
                });
                oldReward = newReward;
            }

            $(".miles-calc-results > p").eq(0).fadeOut(500, function() {
                //show answers panel
                $('#miles').removeClass('d-none');
                $('#annualMilesAmt').text(addCommas(annualSpend));
                $('#monthMilesAmt').text(addCommas(spend));	
                $(this).fadeIn(500);
            });

            var allMilesCards = document.querySelectorAll('[data-miles-multiplier]');
            var count = 1;
            var intrest =0.0119;
            var cost = 0.0085;
            var milesResult = 0;
            var milesResult = addCommas(Math.floor(annualSpend * intrest /cost ));
                
            $('#miles-result-1').fadeOut(500, function() {              
                $('#monthMilesAmt').html(addCommas(spend)).fadeIn(500);
                $('#miles-result-1').html(milesResult).fadeIn(500);
            });
        }

        function addCommas(e) {
            e += "",
            x = e.split("."),
            x1 = x[0],
            x2 = x.length > 1 ? "." + x[1] : "";
            for (var t = /(\d+)(\d{3})/; t.test(x1); )
                x1 = x1.replace(t, "$1,$2");
            return x1 + x2
        }

    }

    function trackVAAClick(){
        if(window._gaq){
             _gaq.push(['_trackEvent', 'Virgin Atlantic Saver product', 'Click', 'Virgin Atlantic saver miles calculator - monthly spend: ' + $('#monthly_spend').val()])
        } else {
            console.warn('GA not found')
        }
    }
    //show input form and hide result
    $('.vaa-calc-form').removeClass('d-none')
    $('#miles').addClass('d-none')
        
    $('.btn--vaa-calc').on("click", function(){
        CalculateSavingsMiles();
        trackVAAClick();
    })

    $('.input--vaa-calc').on('keypress' , function(e){
        //track enter
        if(e.which == 13){
            CalculateSavingsMiles();
            trackVAAClick();
        }
    })

});
