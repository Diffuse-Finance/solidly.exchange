import { Paper, Typography  } from '@material-ui/core';
import classes from "./ssVest.module.css";
import moment from 'moment';
import { formatCurrency } from '../../utils';
import BigNumber from "bignumber.js";

export default function VestingInfo({ currentNFT, futureNFT, veToken, govToken, showVestingStructure }) {
  return (
    <div className={ classes.vestInfoContainer }>
      <div className={classes.vestVotingPower}>
        { currentNFT &&
          <>
            <Typography className={ classes.expiresIn }>Your current voting power is:</Typography>
            <div className={ classes.mainSection }>
              <Typography className={ classes.expiresIn }>{ formatCurrency(currentNFT?.lockValue) } { veToken?.symbol}</Typography>
              <div className={ classes.values }>
                <Typography color='textSecondary' align='right' className={ classes.val }>{ formatCurrency(currentNFT.lockAmount) } { govToken?.symbol } locked expires { moment.unix(currentNFT?.lockEnds).fromNow() } </Typography>
                {/* <Typography color='textSecondary' align='right' className={ classes.val }>Locked until { moment.unix(currentNFT?.lockEnds).format('YYYY / MM / DD') }</Typography> */}
              </div>
            </div>
          </>
        }
        {
          futureNFT &&
          <>
            <Typography className={ classes.expiresIn }>Your voting power will be:</Typography>
            <div className={ classes.mainSection }>
              <Typography className={ classes.expiresIn }>{ formatCurrency(futureNFT?.lockValue) } { veToken?.symbol}</Typography>
              {/* <div className={ classes.values }> */}
                {/* <Typography color='textSecondary' align='right' className={ classes.val }>Locked until { moment.unix(futureNFT?.lockEnds).format('YYYY / MM / DD') }</Typography> */}
              {/* </div> */}
            </div>
          </>
        }
      </div>
      {
        showVestingStructure &&
        <div>
          <Typography className={ classes.info} color='textSecondary'>Voting power for 1 { govToken?.symbol } locked</Typography>
          <div className={ classes.seccondSection }>
            <Typography className={ classes.info} color='textSecondary'>Period of lock</Typography>
            <Typography className={ classes.info} color='textSecondary'>1 years</Typography>
            <Typography className={ classes.info} color='textSecondary'>2 years</Typography>
            <Typography className={ classes.info} color='textSecondary'>3 years</Typography>
            <Typography className={ classes.info} color='textSecondary'>4 years</Typography>
            <Typography className={ classes.info} color='textSecondary'>Voting power</Typography>
            <Typography className={ classes.info} color='textSecondary'>0.25 { veToken?.symbol }</Typography>
            <Typography className={ classes.info} color='textSecondary'>0.50 { veToken?.symbol }</Typography>
            <Typography className={ classes.info} color='textSecondary'>0.75 { veToken?.symbol }</Typography>
            <Typography className={ classes.info} color='textSecondary'>1.00 { veToken?.symbol }</Typography>
          </div>
        </div>
      }
      
    </div>
  )
}
