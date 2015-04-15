/**
 * Created by Abdelkader on 2015-02-01.
 */
// We create a route of type CourseBlog.PostsRoute
StockMarket.StockStateSummaryRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('company');
        // "this.store" is the data store represented by the adapter
    }
});