

StockMarket.placeSellOrderController = Ember.ObjectController.extend({
    actions: {
        submit: function() {
            var newSellOrder = this.store.createRecord('sellOrder', {
                price: this.get('price'),
                volume: this.get('volume')
            });
            newSellOrder.save();
            this.transitionToRoute('stockStateSummary');
        },
        cancel: function() {
            this.transitionToRoute('stockStateSummary');
        }
    }
});