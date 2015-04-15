/**
 * Created by Abdelkader on 2015-02-01.
 */
// We create a model of type CourseBlog.Posts
StockMarket.SellOrder = DS.Model.extend({
    price: DS.attr(),
    volume: DS.attr(),
    company: DS.belongsTo('company')
});


