
/*globals XT */

/** @class

*/
// Contact.TableRow = XT.RowTemplate.extend(
//   /** @scope XT.RowTemplate.prototype */ {
// 
//   templateName: "contact_row",
//   
//   click: function() {
//     this.get("table").select(this);
//     return YES;
//   },
//   
//   contactName: function() {
//     return (this.getPath("content.contactFirstName") + " " +
//       this.getPath("content.contactLastName")) || "No Name Provided";
//   }.property("*content.contactFirstName", "*content.contactLastName").cacheable(),
//   
//   crmAccountLine: function() {
//     var content = this.get("content"),
//       nam, num;
//     nam = content.get("crmAccountName");
//     num = content.get("crmAccountNumber");
//     if(!nam) return "";
//     if(!num) return nam;
//     return nam + " (" + num + ")";
//   }.property("*content.crmAccountNumber", "*content.crmAccountName").cacheable(),
//   
//   isSelected: NO
//     
// });
