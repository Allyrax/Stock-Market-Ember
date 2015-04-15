/*StockMarket.Router.reopen({
    location: 'history'
});*/

StockMarket.Router.map(function() {
    this.resource('stockStateSummary', {path: '/'}, function() {
        this.resource('company', {path: '/company/:company_id'}), function() {
            this.resource('marketByOrder');
            this.resource('marketByPrice');
        },
        this.resource('placeSellOrder', {path: '/placeSellOrder/:company_id'});
        this.resource('placeBidOrder', {path: '/placeBidOrder/:company_id'});
    });

    /*
    this.resource('about');
    this.resource('contact', function(){
        this.resource('phone');
        this.resource('email');
    });
    this.resource('post', {path: 'posts/:post_id'});
    this.resource('addNewPost');
    */

});
