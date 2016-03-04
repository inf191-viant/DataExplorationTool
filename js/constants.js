if(typeof Merquery == "undefined" ) {
    Merquery = {};
}
//Go to https://console.cloud.google.com/apis/credentials?project=uci-student-project
//Create OAuth 2.0 client IDs since authentication to GBQ requires a client_id
//The project_id should be set up when the data tables are created
//The scope is always https://www.googleapis.com/auth/bigquery

//Configurations for connecting to Google BigQuery
Merquery.Constants = {
    project_id: 'uci-student-project',
    client_id:  '998087691315-p22i4ufoqh054dam6m5t7d03lb6hamcm.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/bigquery',

}
Merquery.config = {
        'client_id': Merquery.Constants.client_id,
        'scope': Merquery.Constants.scope
}

Merquery.databaseConstants = {

       query: [
               {
                   category: "Demographics",
                   columnNames: "Demographics.firstname, Demographics.lastname, Demographics.emailmd5, " +
                   "FLOOR((CURRENT_TIMESTAMP()-MSEC_TO_TIMESTAMP(Demographics.birthdate))/(86400000000*365)) AS Demographics.birthdate, " +
                   "Demographics.gender, Demographics.city, " +
                   "Demographics.ethnicity, Demographics.sexorient, Demographics.marital, Demographics.children",
                   fromStatement: "(SELECT firstname, lastname, emailmd5, birthdate,gender, city, ethnicity, sexorient, marital, children " +
                   "FROM [formal-cascade-571:uci.demo_info] where emailmd5 is not null ) AS Demographics",
                   groupByStatement: "Demographics.firstname, Demographics.lastname, Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, " +
                   "Demographics.ethnicity, Demographics.sexorient, Demographics.marital, Demographics.children",
                   placeholder: "John, Smith, johnSmith@email.com, 13, N/A, Irvine, h, s, d, p",
                   identifier: "Demographics_emailmd5",
                   numOfColumns: 9,
                   identifierColumn: 2

               },
               {
                   category: "Address",
                   columnNames: "Address.Address1, Address.Address2, Address.City, Address.State, Address.Zip",
                   fromStatement: "(SELECT emailmd5, Address1, Address2, City, State, Zip FROM [formal-cascade-571:uci.address_info]) " +
                   "AS Address ON Address.emailmd5 = Demographics.emailmd5",
                   groupByStatement: "Address.Address1, Address.Address2, Address.City, Address.State, Address.Zip",
                   placeholder: "1234 Main St, Apt 111, Irvine, CA, 92612",
                   identifier: "Address_Address1",
                   numOfColumns: 4,
                   identifierColumn: 0
               },
               {
                   category: "Campaign",
                   columnNames: "Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name," +
                   " Campaign.impression_count, Campaign.click_count, Campaign.conversion_count",
                   fromStatement: "(SELECT emailmd5, advertiser_id, advertiser_name, campaign_id, campaign_name, impression_count, " +
                   "click_count, conversion_count FROM [formal-cascade-571:uci.campaign_info]) AS Campaign ON Campaign.emailmd5 = Demographics.emailmd5",
                   groupByStatement: "Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name," +
                   " Campaign.impression_count, Campaign.click_count, Campaign.conversion_count",
                   placeholder: "1234, Disney, 123456, Family Display, 5, 5, 0",
                   identifier: "Campaign_advertiser_id",
                   numOfColumns: 6,
                   identifierColumn: 0
               },
               {
                   category: "Behavior",
                   columnNames: "Behavior.id, Behavior.name, Behavior.last_seen, Behavior.count",
                   fromStatement: "(SELECT emailmd5, id, name, last_seen, count FROM [formal-cascade-571:uci.behavior_info]) " +
                   "AS Behavior ON Behavior.emailmd5 = Demographics.emailmd5",
                   groupByStatement: "Behavior.id, Behavior.name, Behavior.last_seen, Behavior.count",
                   placeholder: "12345, Shopping, 2015-01-15, 5",
                   identifier: "Behavior_id",
                   numOfColumns: 3,
                   identifierColumn: 0
               },
               {
                   category: "Device",
                   columnNames: "Device.device_id, Device.device_name, Device.device_type_id, Device.device_type_name, " +
                   "Device.operating_system, Device.last_seen",
                   fromStatement: "(SELECT emailmd5, device_id, device_name, device_type_id, device_type_name, operating_system, " +
                   "last_seen FROM [formal-cascade-571:uci.device_info]) AS Device ON Device.emailmd5 = Demographics.emailmd5",
                   groupByStatement: "Device.device_id, Device.device_name, Device.device_type_id, Device.device_type_name, " +
                   "Device.operating_system, Device.last_seen",
                   placeholder: "55, Windows Desktop, 1, Desktop, Windows, 2015-01-15",
                   identifier: "Device.device_id",
                   numOfColumns: 5,
                   identifierColumn: 5
               },
               {
                   category: "Purchase",
                   columnNames: "Purchase.advertiser_id, Purchase.last_sales_amount, FORMAT_UTC_USEC(Purchase.last_purchase_date) as Purchase.last_purchase_date, " +
                   "Purchase.ltv_online, Purchase.ltv_offline",
                   fromStatement: "(SELECT emailmd5, advertiser_id, last_sales_amount, last_purchase_date, ltv_online, " +
                   "ltv_offline FROM [formal-cascade-571:uci.purchase_info]) AS Purchase ON Purchase.emailmd5 = Demographics.emailmd5",
                   groupByStatement: "Purchase.advertiser_id, Purchase.last_sales_amount, Purchase.last_purchase_date, " +
                   "Purchase.ltv_online, Purchase.ltv_offline",
                   placeholder: "12345, 50.55, 2015-01-15 04:00:00 UTC, 70.00, 0.0",
                   identifier: "Purchase_advertiser_id",
                   numOfColumns: 4,
                   identifierColumn: 0
               },

               {
                  category: "IpSMID",
                  columnNames: "IpSMID.smid, IpSMID.ipAddress, FORMAT_UTC_USEC(IpSMID.ipLast_seen) as IpSMID.ipLast_seen, FORMAT_UTC_USEC(IpSMID.ipFirst_seen) as IpSMID.ipFirst_seen",
                  fromStatement: "(SELECT emailmd5, smid, ipAddress, ipLast_seen, ipFirst_seen, " +
                  "FROM [formal-cascade-571:uci.ipSMID_info]) AS IpSMID ON IpSMID.emailmd5 = Demographics.emailmd5",
                  groupByStatement: "IpSMID.smid, IpSMID.ipAddress, IpSMID.ipLast_seen, IpSMID.ipFirst_seen",
                  placeholder: "12345, 127.1.1.1, 2015-01-15 04:00:00 UTC, 2015-01-15 04:00:00 UTC",
                  identifier: "IpSMID_smid",
                  numOfColumns: 3,
                  identifierColumn: 0
              }
           ]
}

