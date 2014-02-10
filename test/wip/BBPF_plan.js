describe('Basic Business Process flow', function () {
  describe('Create a new user', function(){
    it('User creates an active user with all privileges assigned on all the modules with enhanced authentication and Shop Floor Workbench option unchecked');
    it('User creates an active user with enhanced authentication option checked');
    it('User creates an active user with Shop Floor Workbench option checked');
    it('User selects to create an inactive user');
    it('User assigns all necessary privileges to a user and cancels the operation');
    it('User selects to schedule Server Maintenance and submits the action to Batch Manager');
  });
  describe('Checking Inventory Items', function ( ) {
    it('User navigates to Bill of Materials screen to verify the Indented BOM present for item "YTRUCK1"');
    it('User navigates to QOH screen to verify the QOH of "YTRUCK1"');
    it('User navigates to QOH screen to verify the QOH of "TBODY1"');
    it('User navigates to QOH screen to verify the QOH of "TWHEEL1"');
    it('User navigates to QOH screen to verify the QOH of "YPAINT1"');
    it('User navigates to QOH screen to verify the QOH of "TSUB1"');
    it('User navigates to QOH screen to verify the QOH of "TBOX1"');
    it('User navigates to QOH screen to verify the QOH of "TINSERT1"');
  });
  describe('User selects to create a sales order', function () {
    it('User navigates to Sales Order-New and selects to create a new Sales order with 7 line items with items whose control methods are "None", "Regular", "Regular/MLC", "Lot", "Lot/MLC", "Serial" and "Serial/MLC" respectively');
    it('User navigates to Sales-Quote-List and selects to convert an existing Quote to a sales order');
  describe('User navigates to Sales-Quote-List and selects to convert an existing Quote which has Prospect as the customer #', function () {
    it('Should create a new sales order');
    it('Should convert the Prospect to Customer');
  });
  });
  describe('User selects to run the Scheduling',function(){
  describe('User selects to run MRP', function () {
    it('User navigates to Schedule-Scheduling-run MRP-by Planner code and schedules the MRP by planner code by entering the cut-off date');
    it('Verify that planned orders for the selected Planner code, site and cutoff date are created');
    it('User Selects a specific Planner Code, specific site and Runs MRP');
    it('Planned orders for the items of the selected planner code and site will be created');
    it('User selects a Planner code pattern, All sites and Runs MRP');
    it('Planned Orders for the matched planner code patterns and sites will be created');
    it('User selects "All Planner Codes", selects the preferred site, enters a valid Cutoff date, enables delete existing Firmed Orders option  and Runs MRP');
    it('Planned orders for all planner codes and preferred site will be created');
    it('Existing Planned Orders will be deleted');
    it('User selects "All Planner Codes", selects the preferred site, enters a valid Cutoff date, enables create MRP Exceptions and Runs MRP');
    it('Planned orders for all planner codes and preferred site will be created');
    it('MRP exceptions will be created and considered while creating planned orders');
    it('User navigates to Schedule-Scheduling-run MRP-by item and schedules the MRP by planner code by selecting the item, selecting the site andentering the cut-off date');
    it('Verify that planned orders for the selected item, site and cutoff date are created');
  }); 
  describe('User selects to run MPS', function () {
    it('User navigates to Schedule-Scheduling-run MPS and schedules the MPS by planner code by entering the cut-off date');
    it('User Selects a specific Planner Code, specific site and Runs MPS');
    it('Planned orders for the items of the selected planner code and site will be created');
    it('User selects a Planner code pattern, All sites and Runs MPS');
    it('Planned Orders for the matched planner code patterns and sites will be created');
  });
    it('User selects to create a Planned order of type PO manually');
    it('User selects to create a Planned order of type WO manually');
    it('User selects to create a Planned order of type TO manually');
  });
  describe('User selects to release the planned orders', function () {
    it('User navigates to Schedule-Reports-Planned orders by-planner code, select the planned PO, releases the order and creates a purchase request');
    it('User navigates to Schedule-Reports-Planned orders by-planner code and selects the planned W/O and selects to release the order and creates a work order');
  });
  describe('User selects to update buffer status', function () {
    it('User navigates to Schedule-Constraint Management-Update Status-by Plannercode and selects to update the Buffer status by Planner Code');
    it('User navigates to Schedule-Constraint Management-Update Status-by item and selects to update the Buffer status by Item number');
  });
  describe('Convert P/R to PO', function (){
    it('User navigates to Purchase-Purchase Requests-by plannercode and releases the purchase request by selecting the vendor to create a purchase order');
    it('User navigates to Purchase-Purchase Order-New and selects to create a new Purchase order by entering a vendor information and creates a new lineitem and saves it');
    it('User selects to delete the existing purchase request');
    it('User navigates to Purchase-Purchaseorder-List Open and selects the purchase order and releases it');
  });
  describe('Receiving', function () {
    it('User navigates to Inventory-Receiving-New Receipt and enters purchase order item number, selects "enter receipt", enters the quantity and creates an item receipt');
    it('User navigates to Inventory-Receiving-New Receipt, selects PO, enters receipts and selects to save the item receipt');
    it('User navigates to Inventory-Receiving-New Receipt, selects PO, enters quantity to receive and selects to post the item receipt');
    it('Post-test: Verify that the QOH of the received item is incremented by the received quantity');
    it('User navigates to Inventory-Receiving-List Unposted Receipts-New, selects PO, selects "Receive all" and selects to post the item receipt');
    it('User navigates to Inventory-Receiving- Purchase order Return selects to return the Items received');
    it('Post-test: Verify that the QOH of the received item is decremented by the received quantity');
    it('User navigates to Inventory-Reports-Inventory Availability-by Planner code and right clicks on the selected item and selects view allocations and views the inventory updating after receiving the items');
    it('User navigates to Accounting-General Ledger-Reports-Transactions and verifies the G/L Entries for the item receipt');
  });
  describe('Accounts Payable', function () {
    it('User navigates to Accounting-A/P-Voucher-New and creates a new voucher by entering purchase order number and amount to distribute');
    it('User enters purchase order number and amount to distribute and saves it');
    it('User navigates to Accounting-A/P-Voucher-List Unposted Vouchers and selects the already created voucher and posts it');
    it('User selects to edit the existing voucher');
    it('User selects to delete the existing voucher');
    it('User navigates to Accounting-Accounts Payable-Payments-Select and selects the voucher for payment and selects the bank checking amount and saves it');
    it('User navigates to A/P workbench and selects the Voucher for Payment');
    it('User navigates to Accounting-Accounts Payable-Payments-Prepare a checkrun and selects the desired banking account and prepares a check run and prints it');
    it('User selects to cancel the preparation of check run');
    it('User navigates to Accounting-Accounts Payable-Payments-Post Checkrun and selects the desired banking account and posts the check');
    it('User selects to take discount on payment, prints and posts the check');
  });
  describe('Work order processing', function () {
    it('User navigates to Manufacture-Reports-Workorder schedule-by planner code and selects the work order and right clicks on it and releases the work order');
    it('User selects to create a dis-assembly work order and release the work order');
    it('User navigates to Manufacture-transactions-issue material-batch and selects to issue the Work order Manually by batch');
    it('Post-test: Verify that the QOH is decremented by the quantity issued. Verify G/L entry for WIP Asset and Inventory Asset');
    it('User navigates to Manufacture-transactions-issue material-item and selects to issue the Work order Manually by item');
    it('Post-test: Verify that the QOH is decremented by the quantity issued. Verify G/L entry for WIP Asset and Inventory Asset');
    it('User navigates to Manufacture-transactions-return material-batch and selects to issue the Work order Manually by batch');
    it('Post-test: Verify that the QOH is incremented by the quantity returned. Verify G/L entry for WIP Asset and Inventory Asset');
    it('User navigates to Manufacture-transactions-return material-item and selects to issue the Work order Manually by item');
    it('Post-test: Verify that the QOH is incremented by the quantity returned. Verify G/L entry for WIP Asset and Inventory Asset');
    it('User navigates to Manufacture-transactions-Post operation, selects a workorder, selects an operation, enters qty. and selects to post');
    it('Post-test: Verify that GL entry is made for WIP asset and Accrued labor and overhead costs');
    it('User navigates to Manufacture-transactions-Correct operation posting, selects a workorder, selects an operation, enters qty. and selects to post');
    it('Post-test: Verify that GL entry is made for WIP asset and Accrued labor and overhead costs');
    it('User navigates to Manufacture-Reports-Workorder schedule-by planned order and selects the work order and right clicks on the order and selects to post the work order');
    it('Post-test: Verify that the QOH of the Work order item is incremented by the quantity posted. Verify G/L entry for WIP Asset and Inventory Asset'); 
    it('User selects to post production screen and enters the quantity to post and scraps it');
    it('POST-TEST: Verify that the QOH is incremented by the quantity posted and Qoh of the scraped item is decremented by the quantity scrapped. Verify G/L entry formanufacturing scrap and WIP Asset');
    it('User enables back flush Materials, back flush operations and posts the work order');
    it('Verify that the QOH of the work order item is incremented by the quantity posted');
    it('User selects to do post production for a disassembly work order');
    it('POST-TEST: Verfiy that the QOH of the Work order item is decremented by the quantity posted');
    it('User navigates to Manufacture->Work Order->Close, selects a work order and closes the work order');
    it('User navigates to Accounting-Reports-Summarized G/L Transactions and selects to view from the Accounting module the entry of Accrued labor and Overhead Costs, WIP Asset and the updating of Warehouse Inventory in G/L transactions');
  });
  describe('Shipping', function () {
    it('User navigates to Inventory-Shipping-Issue stock to shipping and enters the sales order number, Selects the item and issues stock');
    it('POST-TEST: Verify that the QOH is decremented by the quantity issued. Verify G/L entry for Shipping Asset and Inventory Asset');
    it('User navigates to Inventory - Shipping - Issue Stock to Shipping and enters the sales order number, enables "Require Sufficient inventory" and selects the item and issues the stock');
    it('POST-TEST: Verify that issue stock is not possible if the Quantity is less than the quantity entered in Issue to stock');
    it('User navigates to Inventory-Shipping-Ship Order, selects the sales order and ships the order');
    it('POST-TEST:Verify G/L entry for Shipping Asset and Cost of Goods');
    it('User enables the Select for Billing to select the ship order for billing and ships the order');
    it('POST-TEST: Verify that the sales order is selected for billing');
    it('User navigates to Inventory-Shipping-Reports-Shipment-by salesorder and enters the sales order number and selects to view query shipment status');
    it('POST-TEST: Verify G/L entry of Costs of goods sold and Shipping Asset WH1 in the G/L transactions');
  });
  describe('Billing', function () {
    it(' User navigates to Sales-Billing-Invoices-Select orders for billing and enters sales order number, selects the balance, saves and closes the screen');
    it('POST-TEST: Verify that the Sales order is available in Billing selections');
    it('User navigates to Sales-Billing-Invoices-Billing Selection and highlights the order and selects to create a new invoice');
    it('POST-TEST: Verify that an invoice is created for the shipping order');
    it('User navigates to Sales-Billing-Invoices-Create Invoices, selects the customer type and creates the invoices');
    it('POST-TEST: Verify that an invoice is created for the shipped order');
    it('User navigates to Sales-Billing-Invoices-List of Unposted Invoices and selects the existing invoice to print');
    it('User navigates to Sales-Billing-Invoices-List of Unposted Invoices and selects the existing invoice to edit');
    it('User navigates to Sales-Billing-Invoices-List of Unposted Invoices and selects the existing invoice to delete');
    it('User navigates to Accounting->Accounts Receivable->Invoice->Post and selects to post the unposted invoices');
    it('POST-TEST: Verify that unposted invoices are posted and GL Enteries are made for Accounts Receivable, Sales Tax, Shipping Charge and Product Revenue accounts');
    it('User navigates to Accounting-Accounts Receivable-A/R workbench, enters a Cash Receipt, enters the amount received, applies against the invoice and selects to post the receipt');
    it('POST-TEST: Verify G/L entry for Accounts receivable transaction - P/O Liability Clearing');
    it('User navigates to Accounting-Accounts Receivable-A/R Workbench and selects to delete a cash receipt');
    it('POST-TEST: Verify that the associated aropen records are also deleted with the deletion of cash receipt and cash receipt item');
    it('User selects multiple Cash Receipts and posts them');
    it('POST-TEST: Verify that all the selected Cash Receipts are posted succesfully.Verify GL Entry ');
  });
});