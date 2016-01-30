//Configurations for connecting to Google BigQuery
var project_id = 'uci-student-project';
var client_id = '998087691315-p22i4ufoqh054dam6m5t7d03lb6hamcm.apps.googleusercontent.com';
var api_key = 'AIzaSyCi7NAyb8xu7D3KSEVKIIOQp2DpGl3T4gc';
var origin = "http://localhost:63342";
var config = {
    'client_id': client_id,
    'scope': 'https://www.googleapis.com/auth/bigquery'
};
//var selText = 20;

var schema = {
        CRM_EmailMD5: "EmailMD5",
        CRM_birthdate: "Birthdate", // Associated with Age
        CRM_gender: "Gender",
        CRM_city: "City",
        CRM_ethnicity: "Ethnicity",
        CRM_marital: "Marital",
        CRM_children: "Children",
        CRM_region: "Region",
        CRM_postalcode: "Postal Code",
        CRM_education: "Education",
        CampaignAdvertiserID: "CampaignAdvertiserID",
        CampaignID: "CampaignID",
        CampaignImps: "CampaignImps",
        CampaignLastSeen: "CampaignLastSeen",
        DeviceID: "DeviceID",
        DeviceType: "Device Type",
        OperatingSystem: "Operating System",
        DeviceLastSeen: "DeviceLastSeen",
        BehaviorID: "BehaviorID",
        BehaviorGroupID: "BehaviorGroupID",
        BehaviorCountry: "BehaviorCountry",
        BehaviorCount: "BehaviorCount",
        BehaviorSource: "BehaviorSource",
        BehaviorLastSeen: "BehaviorLastSeen"
    }


if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

//$Todo$ Replace constants with the following constants
Merquery.Constants = {
    project_id: 'uci-student-project',
    client_id:  '998087691315-p22i4ufoqh054dam6m5t7d03lb6hamcm.apps.googleusercontent.com',
    api_key:  'AIzaSyCi7NAyb8xu7D3KSEVKIIOQp2DpGl3T4gc',
    origin:  "http://localhost:63342"
}