import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";

import { Typography, Switch, Button, SvgIcon, Badge, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';
import ListIcon from '@material-ui/icons/List';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';

import Navigation from '../navigation'
import Unlock from '../unlock';
import TransactionQueue from '../transactionQueue';

import { ACTIONS } from '../../stores/constants';

import stores from '../../stores';
import { formatAddress } from '../../utils';

import classes from './header.module.css';

function SiteLogo(props) {
  const { color, className } = props;
  return (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" width="119" height="30" viewBox="0 0 119 30" fill="none" className={className}>
    <g clip-path="url(#clip0_225_324)">
      <path d="M44.2267 7.41723C45.7707 8.22413 46.9629 9.38016 47.8034 10.8879C48.644 12.3957 49.0655 14.1543 49.0655 16.1664C49.0655 18.1784 48.644 19.9215 47.8034 21.4009C46.9629 22.8802 45.7707 24.0129 44.2267 24.7991C42.6828 25.5853 40.8853 25.981 38.8345 25.981H32.5422V6.20947H38.8345C40.8853 6.20947 42.6828 6.61292 44.2267 7.41723ZM44.3198 21.4577C45.5534 20.206 46.169 18.4422 46.169 16.1664C46.169 13.8905 45.5534 12.0802 44.3198 10.7896C43.0862 9.49913 41.3146 8.85516 39 8.85516H35.7853V23.3353H39C41.3146 23.3353 43.0862 22.7095 44.3198 21.4577Z" fill="#E3E4E7"/>
      <path d="M51.4578 7.63172C51.0595 7.23344 50.8604 6.73948 50.8604 6.15241C50.8604 5.56534 51.0595 5.07137 51.4578 4.6731C51.856 4.27482 52.35 4.07568 52.9371 4.07568C53.5241 4.07568 53.9897 4.27482 54.3879 4.6731C54.7862 5.07137 54.9854 5.56534 54.9854 6.15241C54.9854 6.73948 54.7862 7.23344 54.3879 7.63172C53.9897 8.02999 53.506 8.22913 52.9371 8.22913C52.3681 8.22913 51.856 8.02999 51.4578 7.63172ZM54.5302 10.3059V25.9809H51.2871V10.3059H54.5302Z" fill="#E3E4E7"/>
      <path d="M63.9465 12.9518H61.0448V25.9811H57.7733V12.9518H55.9241V10.3061H57.7733V9.19663C57.7733 7.39404 58.2517 6.08284 59.2086 5.25784C60.1655 4.43284 61.6707 4.01904 63.719 4.01904V6.72163C62.7336 6.72163 62.0405 6.90525 61.6422 7.27508C61.244 7.6449 61.0448 8.28628 61.0448 9.19404V10.3035H63.9465V12.9492V12.9518Z" fill="#E3E4E7"/>
      <path d="M71.9689 12.9518H69.0672V25.9811H65.7957V12.9518H63.9465V10.3061H65.7957V9.19663C65.7957 7.39404 66.2741 6.08284 67.231 5.25784C68.1879 4.43284 69.6931 4.01904 71.7414 4.01904V6.72163C70.756 6.72163 70.0629 6.90525 69.6646 7.27508C69.2664 7.6449 69.0672 8.28628 69.0672 9.19404V10.3035H71.9689V12.9492V12.9518Z" fill="#E3E4E7"/>
      <path d="M87.6155 10.3062V25.9812H84.3724V24.132C83.8603 24.776 83.1931 25.2855 82.3681 25.6553C81.5431 26.0251 80.6664 26.2087 79.7379 26.2087C78.5043 26.2087 77.4 25.9527 76.425 25.4406C75.4474 24.9286 74.6793 24.1708 74.1207 23.1648C73.562 22.1587 73.2802 20.9458 73.2802 19.5234V10.3062H76.4948V19.0398C76.4948 20.4441 76.8465 21.5199 77.5474 22.2674C78.2483 23.0174 79.2077 23.3924 80.4207 23.3924C81.6336 23.3924 82.5983 23.0174 83.3095 22.2674C84.0207 21.5174 84.375 20.4415 84.375 19.0398V10.3062H87.6181H87.6155Z" fill="#E3E4E7"/>
      <path d="M92.8345 25.5698C91.8569 25.125 91.0862 24.5172 90.5173 23.7491C89.9483 22.981 89.6457 22.1224 89.6069 21.1732H92.9638C93.0207 21.8379 93.3388 22.3913 93.9181 22.8362C94.4974 23.281 95.2216 23.5034 96.0957 23.5034C96.9699 23.5034 97.7121 23.3275 98.2138 22.9758C98.7156 22.6241 98.969 22.1741 98.969 21.6258C98.969 21.0387 98.6897 20.6017 98.1285 20.3172C97.5699 20.0327 96.6828 19.7198 95.4699 19.3784C94.2931 19.0551 93.3362 18.7422 92.5966 18.4396C91.8569 18.137 91.2181 17.6715 90.6776 17.0456C90.1371 16.4198 89.8681 15.5948 89.8681 14.5706C89.8681 13.7353 90.1138 12.9724 90.6078 12.2818C91.1018 11.5887 91.8078 11.0431 92.7285 10.6448C93.6492 10.2465 94.7043 10.0474 95.8992 10.0474C97.6811 10.0474 99.119 10.4974 100.21 11.3974C101.302 12.2974 101.884 13.5258 101.961 15.0827H98.7181C98.6612 14.3818 98.3768 13.8206 97.8647 13.4043C97.3526 12.9879 96.6595 12.7784 95.788 12.7784C94.9164 12.7784 94.2802 12.9387 93.825 13.262C93.3699 13.5853 93.1423 14.012 93.1423 14.5422C93.1423 14.9586 93.2949 15.3103 93.5974 15.5948C93.9 15.8793 94.2699 16.1017 94.7069 16.262C95.144 16.4224 95.788 16.6267 96.6414 16.8749C97.7793 17.1775 98.713 17.4879 99.4423 17.8008C100.172 18.1137 100.803 18.5741 101.333 19.1793C101.863 19.787 102.14 20.5913 102.158 21.5974C102.158 22.4896 101.912 23.2862 101.418 23.987C100.924 24.6879 100.228 25.2387 99.3285 25.637C98.4285 26.0353 97.3707 26.2344 96.1578 26.2344C94.9449 26.2344 93.8199 26.012 92.8423 25.5672L92.8345 25.5698Z" fill="#E3E4E7"/>
      <path d="M118.482 19.3525H106.505C106.601 20.6043 107.064 21.6103 107.899 22.3681C108.734 23.1258 109.759 23.506 110.972 23.506C112.717 23.506 113.948 22.7767 114.67 21.3155H118.169C117.696 22.756 116.837 23.9379 115.593 24.8586C114.352 25.7793 112.81 26.237 110.969 26.237C109.472 26.237 108.129 25.9008 106.942 25.2258C105.758 24.5534 104.827 23.6043 104.154 22.381C103.482 21.1577 103.146 19.7405 103.146 18.1267C103.146 16.5129 103.472 15.0982 104.126 13.875C104.78 12.6517 105.701 11.7077 106.885 11.0431C108.07 10.3784 109.43 10.0474 110.969 10.0474C112.508 10.0474 113.767 10.3706 114.923 11.0146C116.079 11.6586 116.982 12.5663 117.626 13.7301C118.27 14.8965 118.593 16.2387 118.593 17.7568C118.593 18.3439 118.554 18.8767 118.479 19.35L118.482 19.3525ZM115.21 16.7353C115.192 15.5405 114.766 14.5836 113.93 13.862C113.095 13.1405 112.063 12.781 110.829 12.781C109.709 12.781 108.753 13.1379 107.956 13.8465C107.159 14.5551 106.686 15.5198 106.534 16.7353H115.21Z" fill="#E3E4E7"/>
      <path d="M11.9948 5.50845L6.6931 0.219656C6.39828 -0.0751717 5.91983 -0.0751717 5.62241 0.219656L0.222414 5.60672C0.0801724 5.74897 0 5.94035 0 6.14207V23.8265C0 24.0257 0.0801724 24.2197 0.219828 24.3619L5.61983 29.7774C5.91465 30.0748 6.39569 30.0748 6.6931 29.7774L11.9974 24.4602C12.1397 24.3179 12.2172 24.1266 12.2172 23.9248V6.04379C12.2172 5.84207 12.1371 5.65069 11.9948 5.50845Z" fill="#E3E4E7"/>
      <path d="M20.1647 0C17.9095 0 15.9 2.22414 14.5992 5.68707C14.4931 5.96638 14.563 6.2819 14.7724 6.49397L19.6526 11.3586C21.6673 13.3681 21.6724 16.6293 19.663 18.644L14.7828 23.5397C14.5733 23.7517 14.5061 24.0672 14.6095 24.344C15.9104 27.7914 17.9147 30 20.1621 30C24.0828 30 27.2612 23.2836 27.2612 15C27.2612 6.71638 24.0854 0 20.1647 0Z" fill="#E3E4E7"/>
    </g>
    <defs>
      <clipPath id="clip0_225_324">
        <rect width="118.596" height="30" fill="white"/>
      </clipPath>
    </defs>
</SvgIcon>
  );
}

const { CONNECT_WALLET,CONNECTION_DISCONNECTED, ACCOUNT_CONFIGURED, ACCOUNT_CHANGED, FIXED_FOREX_BALANCES_RETURNED, FIXED_FOREX_CLAIM_VECLAIM, FIXED_FOREX_VECLAIM_CLAIMED, FIXED_FOREX_UPDATED, ERROR } = ACTIONS

function WrongNetworkIcon(props) {
  const { color, className } = props;
  return (
    <SvgIcon viewBox="0 0 64 64" strokeWidth="1" className={className}>
      <g strokeWidth="2" transform="translate(0, 0)"><path fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" d="M33.994,42.339 C36.327,43.161,38,45.385,38,48c0,3.314-2.686,6-6,6c-2.615,0-4.839-1.673-5.661-4.006" strokeLinejoin="miter"></path> <path fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" d="M47.556,32.444 C43.575,28.462,38.075,26,32,26c-6.075,0-11.575,2.462-15.556,6.444" strokeLinejoin="miter"></path> <path fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" d="M59.224,21.276 C52.256,14.309,42.632,10,32,10c-10.631,0-20.256,4.309-27.224,11.276" strokeLinejoin="miter"></path> <line data-color="color-2" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" x1="10" y1="54" x2="58" y2="6" strokeLinejoin="miter"></line></g>
      </SvgIcon>
  );
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid rgba(126,153,176,0.2)',
    marginTop: '10px',
    minWidth: '230px',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: 'none',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: '#FFF',
      },
    },
  },
}))(MenuItem);


const StyledSwitch = withStyles((theme) => ({
  root: {
    width: 45,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    paddingTop: 1.5,
    width: '70%',
    margin: 'auto',
    borderRadius: '20px',
    '&$checked': {
      paddingTop: '6px',
      transform: 'translateX(18px)',
      color: 'rgba(128,128,128, 1)',
      width: '25px',
      height: '25px',
      '& + $track': {
        backgroundColor: 'rgba(0,0,0, 0.3)',
        opacity: 1,
      },
    },
    '&$focusVisible $thumb': {
      color: '#ffffff',
      border: '6px solid #fff',
    },
  },
  track: {
    borderRadius: 32 / 2,
    border: '1px solid rgba(104,108,122, 0.25)',
    backgroundColor: 'rgba(0,0,0, 0)',
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});


const StyledBadge = withStyles((theme) => ({
  badge: {
    background: '#06D3D7',
    color: '#000'
  },
}))(Badge);

function Header(props) {

  const accountStore = stores.accountStore.getStore('account');
  const router = useRouter();

  const [account, setAccount] = useState(accountStore);
  const [darkMode, setDarkMode] = useState(props.theme.palette.type === 'dark' ? true : false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [chainInvalid, setChainInvalid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transactionQueueLength, setTransactionQueueLength] = useState(0)

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore('account');
      setAccount(accountStore);
      closeUnlock();
    };
    const connectWallet = () => {
      onAddressClicked();
    };
    const accountChanged = () => {
      const invalid = stores.accountStore.getStore('chainInvalid');
      setChainInvalid(invalid)
    }

    const invalid = stores.accountStore.getStore('chainInvalid');
    setChainInvalid(invalid)

    stores.emitter.on(ACCOUNT_CONFIGURED, accountConfigure);
    stores.emitter.on(CONNECT_WALLET, connectWallet);
    stores.emitter.on(ACCOUNT_CHANGED, accountChanged);
    return () => {
      stores.emitter.removeListener(ACCOUNT_CONFIGURED, accountConfigure);
      stores.emitter.removeListener(CONNECT_WALLET, connectWallet);
      stores.emitter.removeListener(ACCOUNT_CHANGED, accountChanged);
    };
  }, []);

  const handleToggleChange = (event, val) => {
    setDarkMode(val);
    props.changeTheme(val);
  };

  const onAddressClicked = () => {
    setUnlockOpen(true);
  };

  const closeUnlock = () => {
    setUnlockOpen(false);
  };

  useEffect(function () {
    const localStorageDarkMode = window.localStorage.getItem('yearn.finance-dark-mode');
    setDarkMode(localStorageDarkMode ? localStorageDarkMode === 'dark' : false);
  }, []);

  const navigate = (url) => {
    router.push(url)
  }

  const callClaim = () => {
    setLoading(true)
    stores.dispatcher.dispatch({ type: FIXED_FOREX_CLAIM_VECLAIM, content: {} })
  }

  const switchChain = async () => {
    let hexChain = '0xfa'
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChain }],
      });
    } catch (switchError) {
      console.log("switch error",switchError)
    }
  }

  const setQueueLength = (length) => {
    setTransactionQueueLength(length)
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div className={classes.headerContainer}>

        <div className={classes.logoContainer}>
          <a onClick={() => router.push('/home')}><SiteLogo className={classes.appLogo} /></a>
        </div>

        <Navigation changeTheme={props.changeTheme} />

        <div style={{ width: '260px', display: 'flex', justifyContent: 'flex-end' }}>

          { process.env.NEXT_PUBLIC_CHAINID == '4002' &&
            <div className={ classes.testnetDisclaimer}>
              <Typography className={ classes.testnetDisclaimerText}>Testnet</Typography>
            </div>
          }

          { transactionQueueLength > 0 &&
            <IconButton
              className={classes.accountButton}
              variant="contained"
              color={props.theme.palette.type === 'dark' ? 'primary' : 'secondary'}
              onClick={ () => {
                  stores.emitter.emit(ACTIONS.TX_OPEN)
                }
              }>
              <StyledBadge badgeContent={transactionQueueLength} color="secondary" overlap="circular" >
                <ListIcon className={ classes.iconColor}/>
              </StyledBadge>
            </IconButton>
          }
          {account && account.address ?
          <div>
          <Button
            disableElevation
            className={classes.accountButton}
            variant="contained"
            color={props.theme.palette.type === 'dark' ? 'primary' : 'secondary'}
             aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            {account && account.address && <div className={`${classes.accountIcon} ${classes.metamask}`}></div>}
            <Typography className={classes.headBtnTxt}>{account && account.address ? formatAddress(account.address) : 'Connect Wallet'}</Typography>
            <ArrowDropDownIcon className={classes.ddIcon} />
          </Button>

          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            className={classes.userMenu}
          >
            <StyledMenuItem className={classes.hidden} onClick={() => router.push('/dashboard')}>
              <ListItemIcon className={classes.userMenuIcon}>
                <DashboardOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText className={classes.userMenuText} primary="Dashboard" />
            </StyledMenuItem>
            <StyledMenuItem onClick={onAddressClicked}>
              <ListItemIcon className={classes.userMenuIcon}>
                <AccountBalanceWalletOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText className={classes.userMenuText} primary="Switch Wallet Provider" />
            </StyledMenuItem>
          </StyledMenu>
          </div>
          :
          <Button
            disableElevation
            className={classes.accountButton}
            variant="contained"
            color={props.theme.palette.type === 'dark' ? 'primary' : 'secondary'}
            onClick={onAddressClicked}>
            {account && account.address && <div className={`${classes.accountIcon} ${classes.metamask}`}></div>}
            <Typography className={classes.headBtnTxt}>{account && account.address ? formatAddress(account.address) : 'Connect Wallet'}</Typography>
          </Button>
          }

        </div>
        {unlockOpen && <Unlock modalOpen={unlockOpen} closeModal={closeUnlock} />}
        <TransactionQueue setQueueLength={ setQueueLength } />
    </div>
    {chainInvalid ? (
      <div className={classes.chainInvalidError}>
        <div className={classes.ErrorContent}>
          <WrongNetworkIcon className={ classes.networkIcon } />
          <Typography className={classes.ErrorTxt}>
            The chain you're connected to isn't supported. Please check that your wallet is connected to Fantom Mainnet.
          </Typography>
          <Button className={classes.switchNetworkBtn} variant="contained" onClick={()=>switchChain()} >Switch to { process.env.NEXT_PUBLIC_CHAINID == '4002' ? 'Fantom Testnet' : 'Fantom Mainnet' }</Button>
        </div>
      </div>
    ) : null}
    </div>
  );
}

export default withTheme(Header);
