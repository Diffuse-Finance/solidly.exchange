import {
    TextField,
    InputAdornment,
    Button,
    Typography
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';


import classes from './manageLocal.module.css';

const deleteOption = (token) => {
    stores.stableSwapStore.removeBaseAsset(token)
}

const viewOption = (token) => {
    window.open(`${ETHERSCAN_URL}token/${token.address}`, '_blank')
}

const renderManageOption = (asset, idx) => {
    return (
      <MenuItem val={ asset.address } key={ asset.address+'_'+idx } className={ classes.assetSelectMenu } >
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


const ManageLocal = ({ type ,search , onSearchChanged ,filteredAssetOptions , toggleLocal }) => {
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
                className= { classes.buttonManageLocalContainer }
            >
                BACK TO ASSETS
            </Button>
        </div>
        </>
    )
}

export default ManageLocal