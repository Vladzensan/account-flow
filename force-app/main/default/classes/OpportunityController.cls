public with sharing class OpportunityController {
    @AuraEnabled
    public static PricebookEntry getPricebookEntry() {
        return [SELECT Id FROM PricebookEntry LIMIT 1];
    }
}
