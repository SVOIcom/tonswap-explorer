$( ".colored" ).each(function() {
    let cls = parseFloat($(this).text()) > 0 ? "green" : "red";
    $(this).addClass(cls);
  });