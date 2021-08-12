import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';


const app = {
  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);


    const idFromHash = window.location.hash.replace('#/', '');
    let pageMatchingaHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingaHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingaHash);
    
    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attrib */
        const id = clickedElement.getAttribute('href').replace('#','');

        /* run thisAPP.avctivatePage thit that id */
        thisApp.activatePage(id); 

        /* changw URL hash*/ 
        window.location.hash = '#/' + id;
      });
    }
  },
  activatePage: function(pageId){
    const thisApp = this;

    //add class "active" to matching pages, remove it from non-matching
    for(let page of thisApp.pages){
      //if (page.id == pageId){
      //  page.classList.add(classNames.pages.active);
      //} else {
      //  page.classList.remove(classNames.pages.active);
      //}

      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }  
  
    //add class "active" to matching links, remove it from non-matching
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }

  },
  initMenu: function () {
    const thisApp = this;
    for(let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    } 
  },
  initData: function() {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        console.log('parsedResponse: ', parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu(); 
      });

    console.log('thisApp.data: ', JSON.stringify(thisApp.data));
  },
  initCart: function() {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
    console.log('thisApp.cart: ', thisApp.cart);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart',  function(event){
      app.cart.add(event.detail.product);
    });
  }, 
  initBooking: function(){
    const thisApp = this;

    const bookingContainer = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(bookingContainer);

  },

  init: function() {
    const thisApp = this;
    thisApp.initData();
      
    thisApp.initCart();

    thisApp.initPages();

    thisApp.initBooking();
  },

};
app.init(); 