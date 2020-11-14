public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccountsByName(String query){
        if(!String.isBlank(query)) {
            return [FIND :query IN NAME FIELDS RETURNING Account(Id, Name ORDER BY Name)][0];
        } else {
            return new List<Account>();
        }
    }
}
