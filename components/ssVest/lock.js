import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Button, TextField, InputAdornment, CircularProgress, RadioGroup, Radio, FormControlLabel, Tooltip, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { formatCurrency } from '../../utils';
import classes from "./ssVest.module.css";
import stores from '../../stores'
import {
  ACTIONS
} from '../../stores/constants';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import VestingInfo from "./vestingInfo"

export default function ssLock({ govToken, veToken }) {

  const inputEl = useRef(null);
  const router = useRouter();

  const [ lockLoading, setLockLoading ] = useState(false)

  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState(false);
  const [selectedValue, setSelectedValue] = useState('week');
  const [selectedDate, setSelectedDate] = useState(moment().add(7, 'days').format('YYYY-MM-DD'));
  const [selectedDateError, setSelectedDateError] = useState(false);

  useEffect(() => {
    const lockReturned = () => {
      setLockLoading(false)
      router.push('/vest')
    }
    const errorReturned = () => {
      setLockLoading(false)
    }

    stores.emitter.on(ACTIONS.ERROR, errorReturned);
    stores.emitter.on(ACTIONS.CREATE_VEST_RETURNED, lockReturned);
    return () => {
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned);
      stores.emitter.removeListener(ACTIONS.CREATE_VEST_RETURNED, lockReturned);
    };
  }, []);

  const setAmountPercent = (percent) => {
    setAmount(BigNumber(govToken.balance).times(percent).div(100).toFixed(govToken.decimals));
  }

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedValue(null);
  }

  const handleChange = (event) => {
    setSelectedValue(event.target.value);

    let days = 0;
    switch (event.target.value) {
      case 'week':
        days = 7;
        break;
      case 'month':
        days = 30;
        break;
      case 'year':
        days = 365;
        break;
      case 'years':
        days = 1460;
        break;
      default:
    }
    const newDate = moment().add(days, 'days').format('YYYY-MM-DD');

    setSelectedDate(newDate);
  }

  const onLock = () => {
    setAmountError(false)

    let error = false

    if(!amount || amount === '' || isNaN(amount)) {
      setAmountError('Amount is required')
      error = true
    } else {
      if(!govToken.balance || isNaN(govToken.balance) || BigNumber(govToken.balance).lte(0))  {
        setAmountError('Invalid balance')
        error = true
      } else if(BigNumber(amount).lte(0)) {
        setAmountError('Invalid amount')
        error = true
      } else if (govToken && BigNumber(amount).gt(govToken.balance)) {
        setAmountError(`Greater than your available balance`)
        error = true
      }
    }

    if(!error) {
      setLockLoading(true)

      const now = moment()
      const expiry = moment(selectedDate).add(1, 'days')
      const secondsToExpire = expiry.diff(now, 'seconds')

      stores.dispatcher.dispatch({ type: ACTIONS.CREATE_VEST, content: { amount, unlockTime: secondsToExpire } })
    }
  }

  const focus = () => {
    inputEl.current.focus();
  }

  const onAmountChanged = (event) => {
    setAmountError(false)
    setAmount(event.target.value)
  }

  const renderMassiveDateInput = (type, amountValue, amountError, amountChanged, balance, logo) => {
    return (
      <div className={ classes.textField}>
        <div className={ `${classes.massiveInputContainer} ${ (amountError) && classes.error }` }>
          {/* <div className={ classes.massiveInputAssetSelect }>
            <div className={ classes.displaySelectContainer }>
              <div className={ classes.assetSelectMenuItem }>
                <div className={ classes.displayDualIconContainer }>
                  <div className={ classes.displayAssetIcon } onClick={ focus }>

                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className={ classes.massiveInputAmount }>
            <TextField
              inputRef={inputEl}
              id='someDate'
              type="date"
              placeholder='Expiry Date'
              fullWidth
              error={ amountError }
              helperText={ amountError }
              value={ amountValue }
              onChange={ amountChanged }
              disabled={ lockLoading }
              inputProps={{
                min: moment().add(7, 'days').format('YYYY-MM-DD'),
                max: moment().add(1460, 'days').format('YYYY-MM-DD')
              }}
              InputProps={{
                className: classes.largeInput,
                shrink: true
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  const renderMassiveInput = (type, amountValue, amountError, amountChanged, token) => {
    return (
      <div className={ classes.textField}>
        <div className={ classes.inputTitleContainer }>
          
        </div>
        <div>
        <div className={ `${classes.massiveInputContainer} ${ (amountError) && classes.error }` }>
          <div className={ classes.massiveInputAssetSelect }>
            <div className={ classes.displaySelectContainer }>
              <div className={ classes.assetSelectMenuItem }>
                <div className={ classes.displayDualIconContainer }>
                  {
                    token && token.logoURI &&
                    <img
                      className={ classes.displayAssetIcon }
                      alt=""
                      src={ token.logoURI }
                      height='100px'
                      onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
                    />
                  }
                  {
                    !(token && token.logoURI) &&
                    <img
                      className={ classes.displayAssetIcon }
                      alt=""
                      src={ '/tokens/unknown-logo.png' }
                      height='100px'
                      onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
                    />
                  }
                  <Typography color='textSecondary' className={ classes.smallerText }>{ token?.symbol }</Typography>

                </div>           
              </div>
            
            </div>
          </div>
          <div className={ classes.massiveInputAmount }>
            <TextField
              placeholder='0.00'
              fullWidth
              error={ amountError }
              helperText={ amountError }
              value={ amountValue }
              onChange={ amountChanged }
              disabled={ lockLoading }
              InputProps={{
                className: classes.largeInput
              }}
            />
          </div>
          </div>
        <Typography className={ classes.inputBalanceText } onClick={ () => {
                  setAmountPercent(100)
                }}>
                  You have { (token && token.balance) ? ' ' + formatCurrency(token.balance) : '' }
        </Typography> 
        </div>
      </div>
    )
  }

  const getTmpNFT = () => {
      const now = moment()
      const expiry = moment(selectedDate)
      const dayToExpire = expiry.diff(now, 'days')
    
      const tmpNFT = {
        lockAmount: amount,
        lockValue: BigNumber(amount).times(parseInt(dayToExpire)+1).div(1460).toFixed(18),
        lockEnds: expiry.unix()
      }
      return tmpNFT
  }
  const renderVestInformation = () => {

    const tmpNFT = getTmpNFT()
    return (<VestingInfo futureNFT={tmpNFT} govToken={govToken} veToken={veToken} showVestingStructure={ true } />)
  }

  const onBack = () => {
    router.push('/vest')
  }

  return (
    <>
      <Paper elevation={0} className={ classes.paperContainer }>
        <div className={ classes.container3 }>
            <div className={ classes.titleSection }>
            <Tooltip title="Back to Vest" placement="top">
              <IconButton className={ classes.backButton } onClick={ onBack }>
                <ArrowBackIcon className={ classes.backIcon } />
              </IconButton>
              </Tooltip>
              <Typography className={ classes.titleText }>Create New Lock</Typography>
            </div>
            { renderMassiveInput('amount', amount, amountError, onAmountChanged, govToken) }
            <div>
              <div className={ classes.inline }>
                <Typography className={ classes.expiresIn }>Expires: </Typography>
                <RadioGroup className={classes.vestPeriodToggle} row onChange={handleChange} value={selectedValue}>
                  <FormControlLabel className={ `${classes.vestPeriodLabel} ${selectedValue === "week" ? classes.vestPeriodLabelActive : ''}` } value="week" control={<Radio  style={{display:'none'}} color="primary" />} label="1 week" labelPlacement="left" />
                  <FormControlLabel className={ `${classes.vestPeriodLabel} ${selectedValue === "month" ? classes.vestPeriodLabelActive : ''}` } value="month" control={<Radio  style={{display:'none'}} color="primary" />} label="1 month" labelPlacement="left" />
                  <FormControlLabel className={ `${classes.vestPeriodLabel} ${selectedValue === "year" ? classes.vestPeriodLabelActive : ''}` } value="year" control={<Radio  style={{display:'none'}} color="primary" />} label="1 year" labelPlacement="left" />
                  <FormControlLabel className={ `${classes.vestPeriodLabel} ${selectedValue === "years" ? classes.vestPeriodLabelActive : ''}` } value="years" control={<Radio  style={{display:'none'}} color="primary" />} label="4 years" labelPlacement="left" />
                  {/* <FormControlLabel className={ `${classes.vestPeriodLabel}`} onClick = {() => { console.log("asdsadas")}} control={<></>} label="PICK A DATE" labelPlacement="left" /> */}
                </RadioGroup>
              </div>
              <div className={classes.dateContainer}>
                <div className={ classes.inlineDate }>
                  <Typography className={ classes.expiresIn }>Locked until: </Typography>
                  { renderMassiveDateInput('date', selectedDate, selectedDateError, handleDateChange, govToken?.balance, govToken?.logoURI) }
                </div>
                <Typography color='textSecondary' align='right' className={ classes.inputBalanceText }>{ formatCurrency(getTmpNFT().lockAmount) } { govToken?.symbol } locked expires { moment.unix(getTmpNFT()?.lockEnds).fromNow() } </Typography>
              </div>
            </div>
            { renderVestInformation() }
        </div>
        <div className={ classes.actionsContainer }>
          <Button
            className={classes.buttonOverride}
            fullWidth
            variant='contained'
            size='large'
            color='primary'
            disabled={ lockLoading }
            onClick={ onLock }
            >
            <Typography className={ classes.actionButtonText }>{ lockLoading ? `Locking` : `Lock` }</Typography>
            { lockLoading && <CircularProgress size={10} className={ classes.loadingCircle } /> }
          </Button>
        </div>
      </Paper><br /><br />
    </>
  );
}
