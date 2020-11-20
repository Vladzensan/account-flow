({
    initColumns: function(component) {
        component.set('v.columns', [
            {label: 'Contact', fieldName: 'ContactName', type: 'text'},
            {label: 'Role', fieldName: 'Role', type: 'text'},
            {label: 'Action', type: 'button', typeAttributes: { label: 'Delete', name: 'delete'}}
        ]);

        var cols = [
            {label: 'Name', fieldName: 'Name', type: 'text'}
        ];
        component.set("v.contactColumns", cols);
    },

    initContacts: function(component) {
        var action = component.get("c.getAllContacts");
        var AccountId = component.get("v.AccountId");

        action.setParams({
            accountId: AccountId
        });

        action.setCallback(this, function(response) {
            component.set("v.contacts", response.getReturnValue());
        });
        
        $A.enqueueAction(action);
    },

    initRole: function(component) {
        var roleStub = {
            'sobjectType': 'OpportunityContactRole'
        };

        component.set("v.contactRole", roleStub);
    },

    initListRoles: function(component) {
        var rolesStub = [];
        component.set("v.ContactRoles", rolesStub);
    },

    addRole: function(component) {
        let role = component.get("v.contactRole");
        let roles = component.get("v.ContactRoles");
        component.set("v.errorDuplicate", false);

        role.Role = component.find("role").get("v.value");
        var selectedContacts = component.find("contactsTable").getSelectedRows();
        role.ContactId = selectedContacts[0].Id;


        for(let i=0; i<roles.length; i++){
            if(roles[i].ContactId == role.ContactId){
                component.set("v.errorDuplicate", true);
                component.set("v.messageDuplicate", 'You already have a Contact Role with this Contact!');
                return;
            }
        }

        component.set("v.isEmpty", false);
        roles.push(role);
        component.set("v.ContactRoles", roles);

        var RolesView = component.get("v.contactRolesView");
        role.ContactName = selectedContacts[0].Name;
        RolesView.push(role);
        component.set("v.contactRolesView", RolesView);

        this.updatePrimarySelectList(component, role);
        this.setEmptyRole(component);
    },

    setEmptyRole: function(component){
        let getRoleAction = component.get("c.createRole");
        getRoleAction.setCallback(this, function(response) {
            let state = response.getState();
            if(state === "SUCCESS") {
                component.set("v.contactRole", response.getReturnValue());
            }
            else{
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(getRoleAction);
    },

    deleteRole: function(component, event) {
        var action = event.getParam('action');
        var row = event.getParam('row');

        switch(action.name){
            case 'delete': {
                var rows = component.get('v.contactRolesView');
                var rowsToInsert = component.get('v.ContactRoles');
                var rowIndex = rows.indexOf(row);
                rows.splice(rowIndex, 1);
                rowsToInsert.splice(rowIndex, 1);
                component.set('v.ContactRoles', rowsToInsert);
                component.set('v.contactRolesView', rows);

                var index = 0;
                var primaryCL = component.get("v.primaryContactSelectList");
                for(let i=0; i<primaryCL.length; i++){
                    if(primaryCL[i].value == row.ContactId){
                        index = i;
                    }
                }
                primaryCL.splice(index, 1);
                component.set('v.primaryContactSelectList', primaryCL);

                if(rows.length == 0) {
                    component.set("v.isEmpty", true);  
                }
            }
            break;
        }
    },

    initPickList: function(component){
        var action = component.get("c.getPicklistRoles");

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var obj = response.getReturnValue();
                component.set("v.defaultPLvalue", obj[0]);
                component.set("v.picklistValues", response.getReturnValue());                
            }
            else {
                console.log("Failed with state: " + state);
            }
        });

        $A.enqueueAction(action);
    },

    selectPrimaryContact: function(component, event){
        var selectedContact = event.getParam("value");
        var contactRoles = component.get("v.ContactRoles");
        contactRoles.forEach(role => {
            role.IsPrimary = false;
            if(role.ContactId == selectedContact){
                role.IsPrimary = true;
            }
        });
        component.set("v.ContactRoles", contactRoles);
    },

    updatePrimarySelectList: function(component, contactItem){
        var primaryContactList = component.get("v.primaryContactSelectList");
        primaryContactList.push({
            "label": contactItem.ContactName,
            "value": contactItem.ContactId
        });
        component.set("v.primaryContactSelectList", primaryContactList);
    },

})