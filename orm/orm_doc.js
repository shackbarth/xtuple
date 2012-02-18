{
  /* A container identifier that typicall correlates
     with a name space defined on the client side of
     the application.
     
     Required.
     
     @type {String}
  */
  
  "nameSpace": "XM",
  
  /* A specific record type as defined on the
     client side of the application.
     
     Required.
     
     @type {String}
  */
  "type": "ProjectTask",
  
  /* Context is sub container for name space that
     allows extending the same name space and type
     in different contexts. The name space, type
     and context must be unique. If you need to
     extend an ORM, you should create a new
     context for each extension.
    
     Required.
     
     @type {String}
  */
  "context": "xtuple",
  
  /* The source table from which you are drawing data. 
     
     Required.
     
     @type {String}
  */
  "table": "prjtask",
  
  /* The table sequence to use when generating the next
     unique record id. Necessary for any objects for which
     new records can be created.
 
     @type {String}    
  */
  "idSequenceName": "prjtask_prjtask_id_seq",
  
  /* Text describing the purpose of the ORM which
     will be appended to the associated view.
     
     @type {String}
  */
  "comment": "Project Task Map",
  
  /* Indicates whether the record can be created.
  
     @type {Boolean}
     @default true
  */
  "canCreate":
  
  /* Indicates whether the record can be updated.
  
     @type {Boolean}
     @default true
  */
  "canUpdate":
  
  /* Indicates whether the record can be deleted.
  
     @type {Boolean}
     @default true
  */
  "canDelete":
  
  /* Used to describe which privilege codes control
     access privileges. If absent and the record is not
     nested, it will not be updatable.
     
     @type {Object}
  */
  "privileges": {
    /* Describes privileges that allow a user to have
       access to all records of this object type. Required
       if privileges are defined. A single privilege can
       control multiple or all create, read, update and
       delete (aka. crud) access methods.
       
       @type {Hash}
    */
    "all": {
      /* The create privilege for this object.
      
      @type {String}
      */
      "create": "MaintainAllProjects",
      
      /* The create privilege for this object. 
      
      @type {String}
      */
      "read": "ViewAllProjects",
      
      /* The update privilege for this object. This 
         privilege also implicitly enables read access if
         the privilege for read is not explicitly granted.
      
      @type {String}
      */
      "update": "MaintainAllProjects",
      
      /* The delete privilege for this object.
      
      @type {String}
      */
      "delete": "MaintainAllProjects"
    },
    
    /* Describes privileges that allow a user to have
       access only to specific records of this object type
       as defined by some relationship between the user
       and the record as determined by matching logged in
       user account name to the value of the fields listed 
       in the "properties" array on a record by record basis.
       
       @type {Hash}
    */
    "personal": {
      /* The personal create privilege for this object.
      
      @type {String}
      */
      "create": "MaintainPersonalProjects",
      
       /* The personal read privilege for this object.
      
      @type {String}
      */
      "read": "ViewPersonalProjects",
      
      /* The personal update privilege for this object.
         This privilege also implicitly enables read access if
         the privilege for read is not explicitly granted.
      
      @type {String}
      */
      "update": "MaintainPersonalProjects",
      
      /* The personal delete privilege for this object.
      
      @type {String}
      */
      "delete": "MaintainPersonalProjects",
      
      /* An array properties on the object on which to
         compare the logged in user account name to 
         determine access.
      
      @type {Array}
      */
      "properties": [
        "owner",
        "assignedTo",
        "projectOwner",
        "projectAssignedTo"
       ]
    }
  },
  /* The mapping array of client object properties to table columns.
     Each hash listed should have one and only one of the following
     properties: attr, toOne or toMany, the purposes of which are
     described below.
  
     @type {Array}
  */
  "properties": [
    {
      /* The property name of the object
       
         @type {String}
      */
      "name": "guid",
      
      /* Indicates this property is an attribute
         that maps directly to table column.
         
         @type {Hash}
      */
      "attr": {
        /* The expected javascript type of the property.
           Should be Number, String or Date.
           
           @type {String}
        */
        "type": "Number",
        
        /* The mapped database column associated with
           this property.
           
           @type {String}
        */        
        "column": "prjtask_id",
        
        /* Indicates this column is the relation to be
           used qualifying updates, deletions.
           
           @type {Boolean}
           @default false
        */   
        "isPrimaryKey": true,
        
        /* Indicates a fixed value on which to filter
           all reads and set as default on new inserts 
           It can not be updated. Useful for tables that 
           store data of mixed types where one column holds
           a source code string that designates the type.
           It forces queries to return and affect
           with records with values that match the one
           defined here.
           
           @type {Any}
           @default false
        */   
        "value": "TA",
        
        /* Flags whether the proprety should be visible
           on query results or not. Useful when used
           in conjunction with "value" where there is no
           need to see the predetermined value at all.
           
           @type {Boolean}
           @default {true}
        */
        "isVisible": false
      },
      
      /* Indicates this property will query the entire
         contents of the record to which this column is
         related.
         
         @type {Hash}
      */
      "toOne": {
        
        /* The non-name space qualified type name of the
           object to which this property is related. This ORM
           will be dependent on the definition of this object
           already existing and will not install unless it does.
           
           A view should exist with a decamelized name that
           corresponds to this type name.
        */
        "type": "UserAccountInfo",
        
        /* The table column to map to. It should be a foreign
           key relation to the corresponding type.
        
           @type {String}
        */
        "column": "prjtask_username",
        
        /* The property relation of the type on which to join.
        
          @type {String}
          @default guid
        "inverse": "username"
      },
      
      /* Indicates this property will query an array of all
         records to which this column is related.
         
         @type {Hash}
      */
      "toMany": {
        "isMaster": true,
        "type": "ProjectTaskComment",
        "column": "prjtask_id",
        "inverse": "project_task",
        "deleteDelegate": {
          "table": "comment",
          "relations": [
            {
              "column": "comment_source_id",
              "inverse": "guid"
            },
            {
              "column": "comment_source",
              "value": "TA"
            }
          ]
        }
      }
    },
    {
      "name": "alarms",
      "toMany": {
        "isMaster": true,
        "type": "ProjectTaskAlarm",
        "column": "prjtask_id",
        "inverse": "project_task"
      }
    }
  ],
  "extensions": [
    {
      "table": "prj",
      "isChild": true,
      "canCreate": false,
      "canUpdate": false,
      "canDelete": false,
      "relations": [
        {
          "column": "prj_id",
          "inverse": "project"
        }
      ],
      "properties": [
        {
          "name": "projectAssignedTo",
          "toOne": {
            "type": "UserAccountInfo",
            "column": "prj_username",
            "inverse": "username"
          }
        },
        {
          "name": "projectOwner",
          "toOne": {
            "type": "UserAccountInfo",
            "column": "prj_owner_username",
            "inverse": "username"
          }
        }
      ]
    }
  ],
  "order": [
    "prjtask_number"
  ],
  "isSystem": true
}
