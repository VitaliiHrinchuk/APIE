

const Tabulator = require('tabulator-tables');

const userData = ipc.sendSync('setuser', "ok");

const USER_TYPES = {
    dispatcher: 1,
    telegraph: 2
}

let tabledata = [];


//init table
module.exports = new Tabulator("#example-table", {
    data:tabledata, //assign data to table
    layout:"fitColumns", //fit columns to width of table (optional)
    paginationSize:12,
    pagination:"local",
    paginationAddRow:"table",

    columns:[ //Define Table Columns
        {title:"id",    field:"id",       headerSort:false, visible: false},
        {title:"Flight",    field:"flight",       headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
        {title:"Type",      field:"type",         headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
        {title:"Departure", field:"departure",    headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
        {title:"Arrival",   field:"arrival",      headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
        {title:"Number",    field:"number",       headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
        {title:"Access",    field:"access",       headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
        {title:"Created",   field:"creation_date",headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
    ],
 
});

