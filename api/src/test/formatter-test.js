const assert = require('chai').assert;
const formatter = require('../lib/formatter')

const sampleData = [{ name: 'poloniex',
                    bids:
                     [ {quantity: 4, rate:  .05},
                       {quantity: 23, rate: .07}],
                     asks:
                     [ {quantity: 5, rate: .02},
                       {quantity: 6, rate: .03}]},
                 { name: 'bittrex',
                     bids:
                      [ {quantity: 5, rate: 0.06},
                        {quantity: 44, rate: 0.04}],
                      asks:
                      [ {quantity: 2, rate: 0.04},
                        {quantity: 8, rate: 0.01}]}]

describe('formatting functionality', function() {
  context('formatBittrex function', function(){
    it('returns a correctly formatted object', function(){
      let sampleResponse = {
        'success': true,
        'message': '',
        'result': {
            'buy': [
                {
                    'quantity': 2,
                    'rate': .05
                }],
                'sell': [
                    {
                        'quantity': 4,
                        'rate': .06
                    }]
                  }
      }
      let result = formatter.formatBittrex(sampleResponse)
      assert.isObject(result)
      assert.equal(result.name, 'bittrex')
      assert.isArray(result.bids)
      assert.isArray(result.asks)
      assert.equal(result.asks[0].quantity, 4)
      assert.equal(result.bids[0].rate, .05)
    })
  })

  context('formatPoloniex function', function(){
    it('returns a correctly formatted object', function(){
      let sampleResponse = {
          'asks': [
              [
                  '.04',
                  3
              ]
          ],
          'bids': [
              [
                  '.07',
                  4
              ]
          ],
          'isFrozen': '0',
          'seq': 423840089
      }
      let result = formatter.formatPoloniex(sampleResponse)
      assert.isObject(result)
      assert.equal(result.name, 'poloniex')
      assert.isArray(result.bids)
      assert.isArray(result.asks)
      assert.equal(result.asks[0].quantity, 3)
      assert.equal(result.bids[0].rate, .07)
    })
  })

  context('formatHitbtc function', function(){
    it('returns a correctly formatted object', function(){
      let sampleResponse = {
          "ask": [
              {
                  "price": "0.04",
                  "size": "5"
              },
              {
                  "price": "0.05",
                  "size": "88"
              }
          ],
          "bid": [
              {
                  "price": "0.04",
                  "size": "2"
              },
              {
                  "price": "0.06",
                  "size": "0.1"
              }
          ]
      }
      let result = formatter.formatHitbtc(sampleResponse)
      assert.isObject(result)
      assert.equal(result.name, 'hitbtc')
      assert.isArray(result.bids)
      assert.isArray(result.asks)
      assert.equal(result.asks[0].quantity, 5)
      assert.equal(result.bids[0].rate, .04)
    })
  })

  context('formatBitstamp function', function(){
    it('returns a correctly formatted object', function(){
      let sampleResponse = {
    "timestamp": "1509907586",
    "bids": [
        [
            "0.03",
            "0.002"
        ],
        [
            "0.0391",
            "33"
        ]],
    "asks": [
       [
           "0.03917",
           "33"
       ],
       [
           "0.039179",
           "7"
       ]]}
      let result = formatter.formatBitstamp(sampleResponse)
      assert.isObject(result)
      assert.equal(result.name, 'bitstamp')
      assert.isArray(result.bids)
      assert.isArray(result.asks)
      assert.equal(result.asks[0].quantity, 33)
      assert.equal(result.bids[0].rate, .03)
    })
  })

  context ('downCase function', function(){
    it('converts json response to lower case object', function(){
      let sampleResponse = {
        'success': true,
        'message': '',
        'result': {
            'buy': [
                {
                    'Quantity': 2,
                    'Rate': .05
                }],
                'sell': [
                    {
                        'Quantity': 4,
                        'Rate': .06
                    }]
                  }
      }
      let result = formatter.downCase(sampleResponse)
      assert.isObject(result)
      assert.equal(result['result']['buy'][0]['quantity'], 2)
      assert.isUndefined(result['result']['buy'][0]['Quantity'])
      assert.equal(result['result']['sell'][0]['rate'], .06)
      assert.isUndefined(result['result']['sell'][0]['Rate'])
    })
  })

  context ('placeholderRowData function', function(){
    it('returns object for each price point with 0 volume placeholders', function(){
      let bidResult = formatter.placeholderRowData(sampleData, 'bids')
      let askResult = formatter.placeholderRowData(sampleData, 'asks')

      assert.isObject(bidResult)
      assert.deepEqual(Object.keys(bidResult), [ '0.07', '0.06', '0.05', '0.04' ])
      assert.equal(bidResult['0.07']['volumes']['poloniex'], 0)
      assert.equal(bidResult['0.07']['volumes']['bittrex'], 0)
      assert.equal(bidResult['0.04']['volumes']['poloniex'], 0)
      assert.equal(bidResult['0.04']['volumes']['bittrex'], 0)

      assert.isObject(askResult)
      assert.deepEqual(Object.keys(askResult), [ '0.01', '0.02', '0.03', '0.04' ])
      assert.equal(askResult['0.01']['volumes']['poloniex'], 0)
      assert.equal(askResult['0.01']['volumes']['bittrex'], 0)
      assert.equal(askResult['0.04']['volumes']['poloniex'], 0)
      assert.equal(askResult['0.04']['volumes']['bittrex'], 0)
    })
  })

  context ('sortPrices function', function(){
    it('sorts prices in ascending order for asks; descending order for bids', function(){
      let bidResult = formatter.sortPrices(sampleData, 'bids')
      let askResult = formatter.sortPrices(sampleData, 'asks')

      assert.deepEqual(bidResult, [ 0.07, 0.06, 0.05, 0.04 ])
      assert.deepEqual(askResult, [ 0.01, 0.02, 0.03, 0.04 ])
    })
  })

  context('askHighlighting function', function(){
    it('returns bg-warning class if there is overlap', function(){
      let overlapResult = formatter.askHighlighting(.06, sampleData)

      assert.equal(overlapResult, 'bg-warning')
    })
    it('is undefined if there is no overlap', function(){
      let noOverlapResult = formatter.askHighlighting(.08, sampleData)

      assert.isUndefined(noOverlapResult)
    })
  })

  context('bidHighlighting function', function(){
    it('returns bg-warning class if there is overlap', function(){
      let overlapResult = formatter.bidHighlighting(.06, sampleData)

      assert.equal(overlapResult, 'bg-warning')
    })
    it('is undefined if there is no overlap', function(){
      let noOverlapResult = formatter.bidHighlighting(.005, sampleData)

      assert.isUndefined(noOverlapResult)
    })
  })
})
