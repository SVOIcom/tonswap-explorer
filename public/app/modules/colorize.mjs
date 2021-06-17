$( ".colored" ).each(function() {

    let change = Number($( this ).text().replace('%', ''));
    change >= 0 ? $( this ).addClass("green") : $( this ).addClass("red"); 

  });