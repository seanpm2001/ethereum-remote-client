import assert from 'assert'
import {
  calcMaxAmount,
} from '../amount-max-button.utils.js'

describe('amount-max-button utils', function () {

  describe('calcMaxAmount()', function () {
    it('should calculate the correct amount when no swapToken defined', function () {
      assert.deepEqual(calcMaxAmount({
        balance: 'ffffff',
        gasTotal: 'ff',
        swapToken: false,
      }), 'ffff00')
    })

    it('should calculate the correct amount when a swapToken is defined', function () {
      assert.deepEqual(calcMaxAmount({
        swapToken: {
          decimals: 10,
        },
        tokenBalance: '64',
      }), 'e8d4a51000')
    })
  })

})
