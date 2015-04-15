

StockMarket.StockStateSummaryController = Ember.ArrayController.extend({
    itemController: 'company',

    sortAscending: true,
    sortProperties: ['company:asc'],
    sortedCompanies: Ember.computed.sort('model', 'sortProperties'),

    isEditing: false,
    actions: {
        sortByVolume: function (sortProperties) {
            this.set('sortProperties',  [sortProperties]);
        },
        sortByGainers: function () {
            this.get('model').save();
            this.set('isEditing', false);
        },
        sortByLosers: function () {
            if (confirm ('Are you sure?')) {
                this.get('model').destroyRecord();
                this.transitionToRoute('posts');
            }
        }
    }
});