import React, { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  InputAdornment,
  Button,
  MenuItem,
  IconButton,
  Dialog,
  CircularProgress,
  SvgIcon,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { withTheme } from '@material-ui/core/styles';

import { formatCurrency } from '../../utils'

import classes from './ssSwap.module.css'

import stores from '../../stores'
import {
  ACTIONS,
  ETHERSCAN_URL
} from '../../stores/constants'

import BigNumber from 'bignumber.js'

import OptionsMenu from '../OptionsMenu'
import ManageLocal from '../ManageLocal'

function Setup() {

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [ loading, setLoading ] = useState(false)
  const [ quoteLoading, setQuoteLoading ] = useState(false)
  const [ approvalLoading, setApprovalLoading ] = useState(false)

  const [ fromAmountValue, setFromAmountValue ] = useState('')
  const [ fromAmountError, setFromAmountError ] = useState(false)
  const [ fromAssetValue, setFromAssetValue ] = useState(null)
  const [ fromAssetError, setFromAssetError ] = useState(false)
  const [ fromAssetOptions, setFromAssetOptions ] = useState([])

  const [ toAmountValue, setToAmountValue ] = useState('')
  const [ toAmountError, setToAmountError ] = useState(false)
  const [ toAssetValue, setToAssetValue ] = useState(null)
  const [ toAssetError, setToAssetError ] = useState(false)
  const [ toAssetOptions, setToAssetOptions ] = useState([])

  const [ slippage, setSlippage ] = useState('2')
  const [ slippageError, setSlippageError ] = useState(false)

  const [ quoteError, setQuoteError ] = useState(null)
  const [ quote, setQuote ] = useState(null)

  useEffect(function() {
    const errorReturned = () => {
      setLoading(false)
      setApprovalLoading(false)
      setQuoteLoading(false)
    }

    const quoteReturned = (val) => {
      if(!val) {
        setQuoteLoading(false)
        setQuote(null)
        setToAmountValue('')
        setQuoteError('Insufficient liquidity or no route available to complete swap')
      }
      if(val && val.inputs && val.inputs.fromAmount === fromAmountValue && val.inputs.fromAsset.address === fromAssetValue.address && val.inputs.toAsset.address === toAssetValue.address) {
        setQuoteLoading(false)
        if(BigNumber(val.output.finalValue).eq(0)) {
          setQuote(null)
          setToAmountValue('')
          setQuoteError('Insufficient liquidity or no route available to complete swap')
          return
        }

        setToAmountValue(BigNumber(val.output.finalValue).toFixed(8))
        setQuote(val)
      }
    }

    const ssUpdated = () => {
      const baseAsset = stores.stableSwapStore.getStore('baseAssets')

      setToAssetOptions(baseAsset)
      setFromAssetOptions(baseAsset)

      if(baseAsset.length > 0 && toAssetValue == null) {
        setToAssetValue(baseAsset[0])
      }

      if(baseAsset.length > 0 && fromAssetValue == null) {
        setFromAssetValue(baseAsset[1])
      }

      forceUpdate()
    }

    const assetsUpdated = () => {
      const baseAsset = stores.stableSwapStore.getStore('baseAssets')

      setToAssetOptions(baseAsset)
      setFromAssetOptions(baseAsset)
    }

    const swapReturned = (event) => {
      setLoading(false)
      setFromAmountValue('')
      setToAmountValue('')
      calculateReceiveAmount(0, fromAssetValue, toAssetValue)
      setQuote(null)
      setQuoteLoading(false)
    }

    stores.emitter.on(ACTIONS.ERROR, errorReturned)
    stores.emitter.on(ACTIONS.UPDATED, ssUpdated)
    stores.emitter.on(ACTIONS.SWAP_RETURNED, swapReturned)
    stores.emitter.on(ACTIONS.QUOTE_SWAP_RETURNED, quoteReturned)
    stores.emitter.on(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated)

    ssUpdated()

    return () => {
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned)
      stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated)
      stores.emitter.removeListener(ACTIONS.SWAP_RETURNED, swapReturned)
      stores.emitter.removeListener(ACTIONS.QUOTE_SWAP_RETURNED, quoteReturned)
      stores.emitter.removeListener(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated)
    }
  },[fromAmountValue, fromAssetValue, toAssetValue]);

  const onAssetSelect = (type, value) => {
    if(type === 'From') {

      if(value.address === toAssetValue.address) {
        setToAssetValue(fromAssetValue)
        setFromAssetValue(toAssetValue)
        calculateReceiveAmount(fromAmountValue, toAssetValue, fromAssetValue)
      } else {
        setFromAssetValue(value)
        calculateReceiveAmount(fromAmountValue, value, toAssetValue)
      }


    } else {
      if(value.address === fromAssetValue.address) {
        setFromAssetError(toAssetValue)
        setToAssetValue(fromAssetValue)
        calculateReceiveAmount(fromAmountValue, toAssetValue, fromAssetValue)
      } else {
        setToAssetValue(value)
        calculateReceiveAmount(fromAmountValue, fromAssetValue, value)
      }
    }

    forceUpdate()
  }

  const fromAmountChanged = (event) => {
    setFromAmountError(false)
    setFromAmountValue(event.target.value)
    if(event.target.value == '') {
      setToAmountValue('')
      setQuote(null)
    } else {
      calculateReceiveAmount(event.target.value, fromAssetValue, toAssetValue)
    }
  }

  const toAmountChanged = (event) => {
  }

  const onSlippageChanged = (event) => {
    if(event.target.value == '' || !isNaN(event.target.value)) {
      setSlippage(event.target.value)
    }
  }

  const calculateReceiveAmount = (amount, from, to) => {
    if(amount !== '' && !isNaN(amount) && to != null) {

      setQuoteLoading(true)
      setQuoteError(false)

      stores.dispatcher.dispatch({ type: ACTIONS.QUOTE_SWAP, content: {
        fromAsset: from,
        toAsset: to,
        fromAmount: amount,
      } })
    }
  }

  const onSwap = () => {
    setFromAmountError(false)
    setFromAssetError(false)
    setToAssetError(false)

    let error = false

    if(!fromAmountValue || fromAmountValue === '' || isNaN(fromAmountValue)) {
      setFromAmountError('From amount is required')
      error = true
    } else {
      if(!fromAssetValue.balance || isNaN(fromAssetValue.balance) || BigNumber(fromAssetValue.balance).lte(0))  {
        setFromAmountError('Invalid balance')
        error = true
      } else if(BigNumber(fromAmountValue).lt(0)) {
        setFromAmountError('Invalid amount')
        error = true
      } else if (fromAssetValue && BigNumber(fromAmountValue).gt(fromAssetValue.balance)) {
        setFromAmountError(`Greater than your available balance`)
        error = true
      }
    }

    if(!fromAssetValue || fromAssetValue === null) {
      setFromAssetError('From asset is required')
      error = true
    }

    if(!toAssetValue || toAssetValue === null) {
      setFromAssetError('To asset is required')
      error = true
    }

    if(!error) {
      setLoading(true)

      stores.dispatcher.dispatch({ type: ACTIONS.SWAP, content: {
        fromAsset: fromAssetValue,
        toAsset: toAssetValue,
        fromAmount: fromAmountValue,
        toAmount: toAmountValue,
        quote: quote,
        slippage: slippage
      } })
    }
  }

  const setBalance100 = () => {
    if(fromAssetValue && toAssetValue){
      setFromAmountValue(fromAssetValue.balance)
      calculateReceiveAmount(fromAssetValue.balance, fromAssetValue, toAssetValue)
    }
  }

  const swapAssets = () => {
    const fa = fromAssetValue
    const ta = toAssetValue
    setFromAssetValue(ta)
    setToAssetValue(fa)
    calculateReceiveAmount(fromAmountValue, ta, fa)
  }

  const renderSwapInformation = () => {

    if(quoteError) {
      return (
        <div className={ classes.quoteLoader }>
          <Typography className={ classes.quoteError }>{ quoteError }</Typography>
        </div>
      )
    }

    if(quoteLoading) {
      return (
        <div className={ classes.quoteLoader }>
          <CircularProgress size={20} className={ classes.loadingCircle } />
        </div>
      )
    }

    if(!quote) {
      return
        <div className={ classes.quoteLoader }> </div>
    }

    return (
      <div className={ classes.depositInfoContainer }>
        <Typography className={ classes.depositInfoHeading } >Price Info</Typography>
        <div className={ classes.priceInfos}>
          <div className={ classes.priceInfo }>
            <Typography className={ classes.title } >{ formatCurrency(BigNumber(quote.inputs.fromAmount).div(quote.output.finalValue).toFixed(18)) }</Typography>
            <Typography className={ classes.text } >{ `${fromAssetValue?.symbol} per ${toAssetValue?.symbol}` }</Typography>
          </div>
          <div className={ classes.priceInfo }>
            <Typography className={ classes.title } > { formatCurrency(BigNumber(quote.output.finalValue).div(quote.inputs.fromAmount).toFixed(18)) } </Typography>
            <Typography className={ classes.text } >{ `${toAssetValue?.symbol} per ${fromAssetValue?.symbol}` }</Typography>
          </div>
          <div className={ classes.priceInfo }>
            { renderSmallInput('slippage', slippage, slippageError, onSlippageChanged) }
          </div>
        </div>
        <Typography className={ classes.depositInfoHeading } >Route</Typography>
        <div className={ classes.route }>
          <img
            className={ classes.displayAssetIconSmall }
            alt=""
            src={ fromAssetValue ? `${fromAssetValue.logoURI}` : '' }
            height='40px'
            onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
          />
          <div className={ classes.line }>
            <div className={classes.routeArrow}>
              <ArrowForwardIosIcon className={classes.routeArrowIcon} />
            </div>
            <div className={ classes.stabIndicatorContainer }>
              <Typography className={ classes.stabIndicator }>{ quote.output.routes[0].stable ? 'Stable' : 'Volatile' }</Typography>
            </div>
          </div>
          { quote && quote.output && quote.output.routeAsset &&
            <>
              <img
                className={ classes.displayAssetIconSmall }
                alt=""
                src={ quote.output.routeAsset ? `${quote.output.routeAsset.logoURI}` : '' }
                height='40px'
                onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
              />
              <div className={ classes.line }>
                <div className={classes.routeArrow}>
                  <ArrowForwardIosIcon className={classes.routeArrowIcon} />
                </div>
                <div className={ classes.stabIndicatorContainer }>
                  <Typography className={ classes.stabIndicator }>{ quote.output.routes[1].stable ? 'Stable' : 'Volatile' }</Typography>
                </div>
              </div>
            </>
          }
          <img
            className={ classes.displayAssetIconSmall }
            alt=""
            src={ toAssetValue ? `${toAssetValue.logoURI}` : '' }
            height='40px'
            onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
          />
        </div>
        {
          BigNumber(quote.priceImpact).gt(0.5) &&
            <div className={ classes.warningContainer }>
              <Typography className={ BigNumber(quote.priceImpact).gt(5) ? classes.warningError : classes.warningWarning } align='center'>Price impact { formatCurrency(quote.priceImpact) }%</Typography>
            </div>
        }
      </div>
    )
  }

  const renderSmallInput = (type, amountValue, amountError, amountChanged) => {
    return (
      <div className={ classes.textField}>
        <div className={ classes.inputTitleContainerSlippage }>
          <div className={ classes.inputBalanceSlippage }>
            <Typography className={ classes.inputBalanceText } noWrap > Slippage </Typography>
          </div>
        </div>
        <div className={ classes.smallInputContainer }>
          <TextField
            placeholder='0.00'
            fullWidth
            error={ amountError }
            helperText={ amountError }
            value={ amountValue }
            onChange={ amountChanged }
            disabled={ loading }
            InputProps={{
              className: classes.smallInput,
              endAdornment: <InputAdornment position="end">
                %
              </InputAdornment>,
            }}
          />
        </div>
      </div>
    )
  }

  const renderMassiveInput = (type, amountValue, amountError, amountChanged, assetValue, assetError, assetOptions, onAssetSelect) => {

    return (
      <div className={ classes.textField}>
        {/* <div className={ classes.inputTitleContainer }>
            <div className={ classes.inputBalance }>
              <Typography className={ classes.inputBalanceText } noWrap onClick={ () => {
                if(type === 'From') {
                  setBalance100()
                }
              }}>
                Balance:
                { (assetValue && assetValue.balance) ?
                  ' ' +   formatCurrency(assetValue.balance) :
                  ''
                }
              </Typography>
            </div>
          </div> */}
          <div className={ `${classes.massiveInputContainer}` }>
              <div className={ classes.inputContainer } >
                  <div className={ classes.massiveInputAmount }>
                    <TextField
                      placeholder='0.00'
                      fullWidth
                      error={ amountError }
                      helperText={ amountError }
                      value={ amountValue }
                      onChange={ amountChanged }
                      disabled={ loading || type === 'To' }
                      InputProps={{
                        inputMode: 'numeric', 
                        className: classes.largeInput
                      }}
                    />

                    <Typography color='textSecondary' className={ classes.smallerText }>{ assetValue?.symbol }</Typography>
                  </div>

                  <div className={classes.inputsButtons} >
                    <div>
                        <div onClick={()=>setBalance100() } className={classes.buttonGreyMax}>
                          <p className={classes.max}>MAX</p>
                        </div>
                    </div>
                    <div>
                      <div className={classes.buttonGreyCoinIcon}>
                        <AssetSelect type={type} value={ assetValue } assetOptions={ assetOptions } onSelect={ onAssetSelect } />
                      </div>
                    </div>
                  </div>
              </div>
              <div className={ classes.balanceInput }>
                <p className={ classes.smallerText}>$100.34</p>
                <p className={ classes.smallerText}>You have { (assetValue && assetValue.balance) ?
                  ' ' +   formatCurrency(assetValue.balance) :
                  ''
                } {assetValue?.symbol}
                </p>
                
              </div>
          </div>
      </div>
    )
  }

  return (
    <div className={ classes.swapInputs }>
      { renderMassiveInput('From', fromAmountValue, fromAmountError, fromAmountChanged, fromAssetValue, fromAssetError, fromAssetOptions, onAssetSelect) }
      <div className={ classes.swapIconContainer }>
        <div className={ classes.swapIconSubContainer }>
          <SvgIcon className={ classes.swapIcon } onClick={ swapAssets } xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6.25 14.5833L7.41667 13.3958L9.16667 15.1458L9.16667 2.5L10.8333 2.5L10.8333 15.1458L12.5833 13.4167L13.75 14.6042L10 18.3333L6.25 14.5833Z" fill="#E3E4E7"/>
          </SvgIcon>
        </div>
      </div>
      { renderMassiveInput('To', toAmountValue, toAmountError, toAmountChanged, toAssetValue, toAssetError, toAssetOptions, onAssetSelect) }
      { renderSwapInformation() }
      <div className={ classes.actionsContainer }>
        <Button
          variant='contained'
          size='large'
          color='primary'
          className={classes.buttonOverride}
          disabled={ loading || quoteLoading }
          onClick={ onSwap }
          >
          <Typography className={ classes.actionButtonText }>{ loading ? `SWAPPING` : `SWAP` }</Typography>
          { loading && <CircularProgress size={10} className={ classes.loadingCircle } /> }
        </Button>
      </div>
    </div>
  )
}

function AssetSelect({ type, value, assetOptions, onSelect }) {

  const [ open, setOpen ] = useState(false);
  const [ search, setSearch ] = useState('')
  const [ filteredAssetOptions, setFilteredAssetOptions ] = useState([])

  const [ manageLocal, setManageLocal ] = useState(false)

  const openSearch = () => {
    setSearch('')
    setOpen(true)
  };

  useEffect(function() {

    let ao = assetOptions.filter((asset) => {
      if(search && search !== '') {
        return asset.address.toLowerCase().includes(search.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
          asset.name.toLowerCase().includes(search.toLowerCase())
      } else {
        return true
      }
    })

    setFilteredAssetOptions(ao)

    //no options in our default list and its an address we search for the address
    // if(ao.length === 0 && search && search.length === 42) {
    //   const baseAsset = await stores.stableSwapStore.getBaseAsset(event.target.value, true, true)
    // }

    return () => {
    }
  }, [assetOptions, search]);


  const onSearchChanged = async (event) => {
    setSearch(event.target.value)
  }

  const onLocalSelect = (type, asset) => {
    setSearch('')
    setManageLocal(false)
    setOpen(false)
    onSelect(type, asset)
  }

  const onClose = () => {
    setManageLocal(false)
    setSearch('')
    setOpen(false)
  }

  const toggleLocal = () => {
    setManageLocal(!manageLocal)
  }

  const deleteOption = (token) => {
    stores.stableSwapStore.removeBaseAsset(token)
  }

  const viewOption = (token) => {
    window.open(`${ETHERSCAN_URL}token/${token.address}`, '_blank')
  }

  const renderManageOption = (type, asset, idx) => {
    return (
      <MenuItem val={ asset.address } key={ asset.address+'_'+idx } className={ classes.assetSelectMenu } >
        <div className={ classes.assetSelectMenuItem }>
          <div className={ classes.displayDualIconContainerSmall }>
            <img
              className={ classes.displayAssetIconSmall }
              alt=""
              src={ asset ? `${asset.logoURI}` : '' }
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
            />
          </div>
        </div>
        <div className={ classes.assetSelectIconName }>
          <Typography variant='h5'>{ asset ? asset.symbol : '' }</Typography>
          <Typography variant='subtitle1' color='textSecondary'>{ asset ? asset.name : '' }</Typography>
        </div>
        <div className={ classes.assetSelectActions}>
          <IconButton onClick={ () => { deleteOption(asset) } }>
            <DeleteOutlineIcon />
          </IconButton>
          <IconButton onClick={ () => { viewOption(asset) } }>
            ↗
          </IconButton>
        </div>
      </MenuItem>
    )
  }

  const renderManageLocal = () => {
    return (
      <>
        <div className={ classes.searchContainer }>
          <div className={ classes.searchInline }>
            <TextField
              autoFocus
              variant="outlined"
              fullWidth
              placeholder="FTM, MIM, 0x..."
              value={ search }
              onChange={ onSearchChanged }
              InputProps={{
                endAdornment: <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>,
              }}
            />
          </div>
          <div className={ classes.assetSearchResults }>
            {
              filteredAssetOptions ? filteredAssetOptions.filter((option) => {
                return option.local === true
              }).map((asset, idx) => {
                return renderManageOption(type, asset, idx)
              }) : []
            }
          </div>
        </div>
        <div className={ classes.manageLocalContainer }>
          <Button
            onClick={ toggleLocal }
            >
            Back to Assets
          </Button>
        </div>
      </>
    )
  }

  return (
    <React.Fragment>
      <div className={ classes.displaySelectContainer } onClick={ () => { openSearch() } }>
            <img
              className={ classes.displayAssetIcon }
              alt=""
              src={ value ? `${value.logoURI}` : '' }
              onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
              />
            <p className={classes.max}>{value ? value?.symbol : ''}</p>
      </div>
      <Dialog onClose={ onClose } aria-labelledby="simple-dialog-title" open={ open } >
        { !manageLocal && <OptionsMenu onLocalSelect = { onLocalSelect } type={type}  search= { search }  onSearchChanged= { onSearchChanged } filteredAssetOptions= { filteredAssetOptions }  toggleLocal= { toggleLocal } /> }
        {  manageLocal && <ManageLocal onLocalSelect = { onLocalSelect } type={type}  search= { search }  onSearchChanged= { onSearchChanged } filteredAssetOptions= { filteredAssetOptions }  toggleLocal= { toggleLocal } /> }
      </Dialog>
    </React.Fragment>
  )
}

export default withTheme(Setup)
