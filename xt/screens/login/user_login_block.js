
enyo.kind(
  /** */ {

  /** */
  name: "XT.UserLoginBlock",
  
  /** */
  kind: "FittableRows",
  
  /** */
  fit: true,
  
  /** */
  classes: "user-login-block",
  
  /** */
  components: [
    { kind: "XT.UserLoginBlockRow", components: [
      { kind: "onyx.InputDecorator", components: [
        { name: "username", kind: "onyx.Input", placeholder: "Username" } ]} ]},
    { kind: "XT.UserLoginBlockRow", components: [
      { kind: "onyx.InputDecorator", components: [
        { name: "password", kind: "onyx.Input", type: "password", placeholder: "Password" } ]} ]},
    { kind: "XT.UserLoginBlockRow", components: [
      { kind: "onyx.InputDecorator", components: [
        { name: "organization", kind: "onyx.Input", placeholder: "Organization" } ]} ]},
    { kind: "XT.UserLoginBlockRow", components: [
      { name: "button", kind: "onyx.Button", content: "Login", handlers: { tap: "login" } } ]}
  ]
    
});

enyo.kind(
  /** */ {

  /** */
  name: "XT.UserLoginBlockRow",
  
  /** */
  classes: "user-login-block-row"
    
});