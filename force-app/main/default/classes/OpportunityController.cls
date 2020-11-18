public with sharing class OpportunityController {
    @AuraEnabled
    public static List<PricebookEntry> getPricebookEntries(){
        Pricebook2 stdPricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true];
        
        return [SELECT Id, Name FROM PricebookEntry WHERE Pricebook2Id = :stdPricebook.Id];
    }
}
