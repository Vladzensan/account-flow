public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccountsByName(String query){
        return [FIND :query IN NAME FIELDS RETURNING Account(Id, Name)][0];
    }
}
