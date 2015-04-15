/**
 * Created by Abdelkader on 2015-02-03.
 */
StockMarket.CompanyRoute = Ember.Route.extend({
    model: function(params) {
        return this.store.find('company', params.company_id);
    }
});