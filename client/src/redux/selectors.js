import {get} from 'lodash';
import {createSelector} from 'reselect';

// Web3
const web3 = state => get(state, 'web3.web3', 0);
export const web3Selector = createSelector(web3, v => v);

// Display
const mintEthValue = state => get(state, 'display.mintEthValue', 0);
export const mintEthValueSelector = createSelector(mintEthValue, v => v);

const mintUsmValue = state => get(state, 'display.mintUsmValue', 0);
export const mintUsmValueSelector = createSelector(mintUsmValue, v => v);