import { LightningElement, track, api, wire} from 'lwc';
import searchAccounts from '@salesforce/apex/AccountController.searchAccountsByName';

const ERROR_NO_ACCOUNT= 'No account have been chosen. Choose one in order to move to the next step';
export default class AccountChoose extends LightningElement {
    @track _accountId;
    @track options;   
    error;
    queryString;

    @wire(searchAccounts, {query: "$queryString"}) 
     wiredAccounts({data, error}) {
         console.log('fetch');
        if (data) {
            this.accounts = data;
            this.error = undefined;

            this.options = data.map(plValue => {
                return {
                    label: plValue.Name,
                    value: plValue.Id
                };
            });
            console.log('current options' + JSON.stringify(this.options));
        } else if (error) {
            this.error = error;
            this.accounts = undefined;
        }
    }

    @api get accountId() {
        return this._accountId;
    }

    set accountId(value) {
        this._accountId = value;
    }

    handleQueryChange(event) {
        this.queryString = event.target.value;
    }

    handleCboxChange(event) {
        this.accountId = event.target.value;
    }

    @api validate() {
        console.log(this.accountId);
        if(this.accountId == null || this.accountId == '') {
            return {
                isValid: false, 
                errorMessage: ERROR_NO_ACCOUNT
            };
        } else {
            return {
                isValid: true
            };
        }
    }

}