/**
 * Created by Abdelkader on 2015-02-01.
 */
// We create a model of type CourseBlog.Posts
StockMarket.Company = DS.Model.extend({
    company: DS.attr(),
    openPrice: DS.attr(),
    currentPrice: DS.attr(),
    change: DS.attr(),
    shareVolume: DS.attr()/*,
    bidOrders: DS.hasMany('bidOrder'),
    sellOrders: DS.hasMany('sellOrder')*/
});

StockMarket.Company.FIXTURES =   [
        { id: 1, company: 'Apple',      openPrice: '46.53',     currentPrice: '0', change: '0', shareVolume: '0'},
        { id: 2, company: 'Facebook',   openPrice: '102.12',    currentPrice: '0', change: '0', shareVolume: '40'},
        { id: 3, company: 'Cisco',      openPrice: '83.23',     currentPrice: '0', change: '0', shareVolume: '30'},
        { id: 4, company: 'Intel',      openPrice: '94.39',     currentPrice: '0', change: '0', shareVolume: '50'},
        { id: 5, company: 'Microsoft',  openPrice: '52.12',     currentPrice: '0', change: '0', shareVolume: '20'}
    ];