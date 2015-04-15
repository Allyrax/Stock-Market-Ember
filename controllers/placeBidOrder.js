

StockMarket.placeBidOrderController = Ember.ObjectController.extend({
    actions: {
        submit: function() {
            var newBidOrder = this.store.createRecord('bidOrder', {
                price: this.get('price'),
                volume: this.get('volume')
            });
            newBidOrder.save();
            this.transitionToRoute('stockStateSummary');
        },
        cancel: function() {
            this.transitionToRoute('stockStateSummary');
        }
    }
});