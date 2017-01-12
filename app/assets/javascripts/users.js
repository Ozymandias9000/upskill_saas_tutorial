/* global $, Stripe */
// Use jQuery Document Ready
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro_form');
  var submitBtn = $('#form-signup-btn');
  
  // Set Stripe public key
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') ); 
  
  // When user clicks form submit btn
  submitBtn.click(function(event){
   // prevent default submission behavior.
    event.preventDefault();
    submitBtn.val('Processing').prop('disabled', true);
  
  // Collect CC fields.
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
        
  // Use Stripe JS library for card errors.
    var error = false;
    
  // Validate CC Card.
    if(!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert('The credit card number appears to be invalid');
    }
    
  // Validate CVC.
    if(!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert('The CVC number appears to be invalid');  
    }
  // Validate Expiration Date.
    if(!Stripe.card.validateExpiry(expMonth, expYear)) {
      error = true;
      alert('The expiration date appears to be invalid');
    }
    if (error) {
    // If errors, don't send to Stripe.
    submitBtn.prop('disabled', false).val('Sign Up');
    } else {
        
      // Send card info to Stripe.
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }
    return false;
  });
  // Stripe returns card token.
  function stripeResponseHandler(status, response) {
    // Get token from response.
    var token = response.id;
    
    // Inject token as hidden field into form.
    theForm.append($('<input type="hidden" name="user[stripe_card_token]">').val(token));
    
    // Submit form to rails app.
    theForm.get(0).submit();
  }
});