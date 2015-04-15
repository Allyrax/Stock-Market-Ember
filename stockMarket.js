
StockMarket = Ember.Application.create();

StockMarket.ApplicationSerializer = DS.LSSerializer.extend();
StockMarket.ApplicationAdapter = DS.FixtureAdapter.extend({
    namespace: 'StockMarket'
});