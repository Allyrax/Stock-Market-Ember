//Stock Market Server
//Matt Laing

var express = require('express');
var bodyParser = require('body-parser');
var Lock = require('lock');
var lock = Lock();

//Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stockMarket');

//Express App
var app = express();

//Logger
var logger = require('./logger');
app.use(logger);

//Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Static Files
app.use(express.static('public'));

//Schemas
var buyOrderSchema = mongoose.Schema({
    timeStamp: Date,
    size: Number,
    price: Number,
    company: { type: mongoose.Schema.ObjectId, ref: 'company' }
});

var saleOrderSchema = mongoose.Schema({
    timeStamp: Date,
    size: Number,
    price: Number,
    company: { type: mongoose.Schema.ObjectId, ref: 'company' }
});

var transactionSchema = mongoose.Schema({
    timeStamp: Date,
    size: Number,
    price: Number,
    company: { type: mongoose.Schema.ObjectId, ref: 'company' }
});

var companySchema = mongoose.Schema({
    name: String,
    symbolURL: String,
    openPrice: Number,
    currentPrice: Number,
    changeValue: Number,
    changeIcon: String,
    changePercentage: Number,
    changeDirection: Number,
    shareVolume: Number,
    buyOrders: [{ type: mongoose.Schema.ObjectId, ref: 'buyOrder'}],
    saleOrders: [{ type: mongoose.Schema.ObjectId, ref: 'saleOrder'}],
    transactions: [{ type: mongoose.Schema.ObjectId, ref: 'transaction'}]
});

var Companies = mongoose.model('Company', companySchema);
var BuyOrders = mongoose.model('buyOrder', buyOrderSchema);
var SaleOrders = mongoose.model('saleOrder', saleOrderSchema);
var Transactions = mongoose.model('transaction', transactionSchema);

//Routes
app.get('/companies', function(request, response){
    //return all the companies
    Companies.find(function(error, companies) {
        if(error) response.send(error);

        else response.json({Companies: companies})
    });
});

app.get('/buyOrders', function(request, response){
    //return all the bid orders
    BuyOrders.find({company: request.query.company}, function(error, buyOrders) {
        if(error) response.send(error);

        else response.json({BuyOrders: buyOrders});
    });
});

app.get('/saleOrders', function(request, response){
    //return all the sale orders
    SaleOrders.find({company: request.query.company}, function(error, saleOrders) {
        if (error) response.send(error);

        else response.json({SaleOrders: saleOrders});
    });
});

app.post('/companies', function(request, response){
    //make a new company
    var company = new Companies({
        name: request.body.company.name,
        symbolURL: request.body.company.symbolURL,
        openPrice: request.body.company.openPrice,
        currentPrice: request.body.company.currentPrice,
        changeValue: request.body.company.changeValue,
        changeIcon: request.body.company.changeIcon,
        changePercentage: request.body.company.changePercentage,
        changeDirection: request.body.company.changeDirection,
        shareVolume: request.body.company.shareVolume,
        buyOrders: [],
        saleOrders: [],
        transactions: []
    });

    company.save(function(error) {
        if (error) response.send(error);

        else response.status(201).json({Companies: company});
    });
});

app.post('/buyOrders', function(request, response){
    //make a new bid order and save it
    var buyOrder = new BuyOrders({
        timeStamp: request.body.buyOrder.timeStamp,
        size: request.body.buyOrder.size,
        price: request.body.buyOrder.price,
        company: request.body.buyOrder.company
    });

    lock('key', function (release) { //called when resource is available.
        buyOrder.save(function (error) {
            if (error) response.send(error);

            else {
                Companies.findByIdAndUpdate(buyOrder.company, {$push: {buyOrders: buyOrder._id}}, {
                    safe: true,
                    upsert: true
                }, release(function (error, company) {
                    if (error) response.send(error);

                    else {
                        response.status(201).json({BuyOrders: buyOrder});
                    }
                }));
            }
        });
    });
});

app.post('/saleOrders', function(request, response){
    //make a new sale order and save it
    var saleOrder = new SaleOrders({
        timeStamp: request.body.saleOrder.timeStamp,
        size: request.body.saleOrder.size,
        price: request.body.saleOrder.price,
        company: request.body.saleOrder.company
    });

    lock('key', function (release) { //called when resource is available.
        saleOrder.save(function (error) {
            if (error) response.send(error);

            else {
                Companies.findByIdAndUpdate(saleOrder.company, {$push: {saleOrders: saleOrder._id}}, {
                    safe: true,
                    upsert: true
                }, release(function (error, company) {
                    if (error) response.send(error);

                    else {
                        response.status(201).json({SaleOrders: saleOrder});
                    }
                }));
            }
        });
    });
});

app.post('/transactions', function(request, response){
    //make a new transaction and save it
    var transaction = new Transactions({
        timeStamp: request.body.transaction.timeStamp,
        size: request.body.transaction.size,
        price: request.body.transaction.price,
        company: request.body.transaction.company
    });

    transaction.save(function(error) {
        if(error) response.send(error);

        response.status(201).json({Transactions: transaction});
    });
});

//Find the company using the id in the url
app.put('/companies/:company_id', function(request, response){
    //update the company
    Companies.findById(request.params.company_id, function(error, company) {
        if (error) response.send(error);

        //update the company
        company.name = request.body.company.name;
        company.symbolURL = request.body.company.symbolURL;
        company.openPrice = request.body.company.openPrice;
        company.currentPrice = request.body.company.currentPrice;
        company.changeValue = request.body.company.changeValue;
        company.changeIcon = request.body.company.changeIcon;
        company.changePercentage = request.body.company.changePercentage;
        company.changeDirection = request.body.company.changeDirection;
        company.shareVolume = request.body.company.shareVolume;

        company.save(function(error) {
            if (error) response.send(error);

            response.status(201).json({Companies: company});
        });
    });
});

app.delete('/buyOrders/:buyOrder_id', function(request, response){
    //lock the collection
    lock('key', function (release) { //called when resource is available.

        //find the buy order and remove it from the company then delete the buy order
        BuyOrders.findById(request.params.buyOrder_id, function(error, buyOrder) {
            if (error) response.send(error);

            else {
                Companies.update({_id: buyOrder.company}, {$pull: {buyOrders: buyOrder._id}}, function (error) {
                    if (error) response.send(err);

                    else {
                        BuyOrders.remove({_id: request.params.buyOrder_id}, release(function (error) {
                            if (error) response.send(err);

                            response.status(201).send({});
                        }));
                    }
                });
            }
        });
    });
});

app.delete('/saleOrders/:saleOrder_id', function(request, response){
    //lock the collection
    lock('key', function (release) { //called when resource is available.

        //find the sale order and remove it from the company then delete the sale order
        SaleOrders.findById(request.params.saleOrder_id, function(error, saleOrder) {
            if(error) response.send(error);

            else {
                Companies.update({_id: saleOrder.company}, { $pull: {saleOrders : saleOrder._id} }, function(error) {
                    if (error) response.send(err);

                    else {
                        SaleOrders.remove({_id: request.params.saleOrder_id}, release(function (error) {
                            if (error) response.send(err);

                            response.status(201).send({});
                        }));
                    }
                });
            }
        });
    });
});

app.listen(3000, function() {
    console.log('App listening on port 3000')
});