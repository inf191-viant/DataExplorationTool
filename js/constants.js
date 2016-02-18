if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

//Configurations for connecting to Google BigQuery
Merquery.Constants = {
    project_id: 'uci-student-project',
    client_id:  '998087691315-p22i4ufoqh054dam6m5t7d03lb6hamcm.apps.googleusercontent.com',
    api_key:  'AIzaSyCi7NAyb8xu7D3KSEVKIIOQp2DpGl3T4gc',
    origin:  "http://localhost:63342",
    scope: 'https://www.googleapis.com/auth/bigquery',

}
Merquery.config = {
        'client_id': Merquery.Constants.client_id,
        'scope': Merquery.Constants.scope
}