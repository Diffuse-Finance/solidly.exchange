import BigNumber from 'bignumber.js'
import {
    TextField,
    InputAdornment,
    Button,
    Typography,
    MenuItem
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';

import classes from './optionsMenu.module.css';

import { formatCurrency} from '../../utils'

const AssetOption = ({type, asset, idx , onLocalSelect}) => {
  
  return (
    <MenuItem val={ asset.address } key={ asset.address+'_'+idx } className={ classes.assetSelectMenu } onClick={ () => { onLocalSelect(type, asset) } }>
      <div className={ classes.assetSelectMenuItem }>
        <div className={ classes.displayDualIconContainerSmall }>
          <img
            className={ classes.displayAssetIconSmall }
            alt=""
            src={ asset ? `${asset.logoURI}` : '' }
            height='60px'
            onError={(e)=>{e.target.onerror = null; e.target.src="/tokens/unknown-logo.png"}}
          />
        </div>
      </div>
      <div className={ classes.assetSelectIconName }>
        <Typography variant='h5'>{ asset ? asset.symbol : '' }</Typography>
        <Typography variant='subtitle1' color='textSecondary'>{ asset ? asset.name : '' }</Typography>
      </div>
      <div className={ classes.assetSelectBalance}>
        <Typography variant='h5'>{ (asset && asset.balance) ? formatCurrency(asset.balance) : '0.00' }</Typography>
      </div>
    </MenuItem>
  )
}

const OptionsMenu = ({onLocalSelect, type ,search , onSearchChanged ,filteredAssetOptions , toggleLocal }) => {
    return (
      <>
        <div className={ classes.searchContainer }>
          <Typography className={ classes.title }>SELECT A TOKEN</Typography>
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
              filteredAssetOptions ? filteredAssetOptions.sort((a, b) => {
                if(BigNumber(a.balance).lt(b.balance)) return 1;
                if(BigNumber(a.balance).gt(b.balance)) return -1;
                if(a.symbol.toLowerCase()<b.symbol.toLowerCase()) return -1;
                if(a.symbol.toLowerCase()>b.symbol.toLowerCase()) return 1;
                return 0;
              }).map((asset, idx) => {
                return < AssetOption onLocalSelect={onLocalSelect} type={type} asset={asset} idx={idx}/>
              }) : []
            }
          </div>
        </div>
        <div className={ classes.manageLocalContainer }>
          <Button
            onClick={ toggleLocal }
            className= { classes.buttonManageLocalContainer }
            >
            MANAGE LOCAL ASSETS
          </Button>
        </div>
      </>
    )
  }

  export default OptionsMenu