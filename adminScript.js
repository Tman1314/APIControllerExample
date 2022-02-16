'use strict';

//Define variables for input elements
let fieldEl = document.getElementById("filterField");
let typeEl = document.getElementById("filterType");
let valueEl = document.getElementById("filterValue");
let categoryEl = document.getElementById("filterCategory");
let startDateEl = document.getElementById("startDate");
let endDateEl = document.getElementById("endDate");

//Trigger setFilter function with correct parameters
function updateFilter(){
  let filterVal = fieldEl.options[fieldEl.selectedIndex].value;
  let typeVal = typeEl.options[typeEl.selectedIndex].value;
  let valueVal = valueEl.value;
  let categoryVal = categoryEl.options[categoryEl.selectedIndex].value;
  let startDateVal = startDateEl.value;
  let endDateVal = endDateEl.value;

//Shows or hides the dropdown for categories
  if(filterVal == "GeneralCategory"){
    document.getElementById("filterCategory").style.display = "inline-block";
    document.getElementById("filterValue").style.display = "none";
  } else {
    document.getElementById("filterCategory").style.display = "none";
    document.getElementById("filterValue").style.display = "inline-block";
  };

//Filter options
  if(filterVal || startDateVal || endDateVal){
    if(filterVal != "" && startDateVal != "" && endDateVal != "" && categoryVal != ""){
      table.setFilter([
        {field:filterVal, type:typeVal, value:categoryVal},
        {field:"Date", type:">=", value:startDateVal},
        {field:"Date", type:"<=", value:endDateVal}
      ]);
    } else if(filterVal != "" && startDateVal != "" && endDateVal == "" && categoryVal != ""){
      table.setFilter([
        {field:filterVal, type:typeVal, value:categoryVal},
        {field:"Date", type:">=", value:startDateVal}
      ]);
    } else if(filterVal != "" && startDateVal == "" && endDateVal != "" && categoryVal != ""){
      table.setFilter([
        {field:filterVal, type:typeVal, value:categoryVal},
        {field:"Date", type:"<=", value:endDateVal}
      ]);
    } else if(filterVal != "" && startDateVal == "" && endDateVal == "" && categoryVal != ""){
      table.setFilter(filterVal, typeVal, categoryVal);
    } else if(filterVal != "" && startDateVal != "" && endDateVal != "" && categoryVal == ""){
      table.setFilter([
        {field:filterVal, type:typeVal, value:valueVal},
        {field:"Date", type:">=", value:startDateVal},
        {field:"Date", type:"<=", value:endDateVal}
      ]);
    } else if(filterVal != "" && startDateVal != "" && endDateVal == "" && categoryVal == ""){
      table.setFilter([
        {field:filterVal, type:typeVal, value:valueVal},
        {field:"Date", type:">=", value:startDateVal}
      ]);
    } else if(filterVal != "" && startDateVal == "" && endDateVal != "" && categoryVal == ""){
      table.setFilter([
        {field:filterVal, type:typeVal, value:valueVal},
        {field:"Date", type:"<=", value:endDateVal}
      ]);
    } else if(filterVal != "" && startDateVal == "" && endDateVal == "" && categoryVal == ""){
      table.setFilter(filterVal, typeVal, valueVal);
    } else if(filterVal == "" && startDateVal != "" && endDateVal != ""){
      table.setFilter([
        {field:"Date", type:">=", value:startDateVal},
        {field:"Date", type:"<=", value:endDateVal}
      ]);
    } else if(filterVal == "" && startDateVal != "" && endDateVal == ""){
      table.setFilter("Date", ">=", startDateVal);
    } else if(filterVal == "" && startDateVal == "" && endDateVal != ""){
      table.setFilter("Date", "<=", endDateVal);
    }
  }
};

//Update filters on value change
document.getElementById("filterField").addEventListener("change", updateFilter);
document.getElementById("filterType").addEventListener("change", updateFilter);
document.getElementById("filterValue").addEventListener("keyup", updateFilter);
document.getElementById("filterCategory").addEventListener("change", updateFilter);
document.getElementById("startDate").addEventListener("change", updateFilter);
document.getElementById("endDate").addEventListener("change", updateFilter);

//Clear filters on "Clear Filters" button click
document.getElementById("filter-clear").addEventListener("click", function(){
  fieldEl.value = "";
  typeEl.value = "=";
  valueEl.value = "";
  categoryEl.value = "";
  startDateEl.value = "";
  endDateEl.value = "";

  document.getElementById("filterCategory").style.display = "none";
  document.getElementById("filterValue").style.display = "inline-block";

  table.clearFilter();
});

var table = new Tabulator("#resos", {
    ajaxURL: "https://localhost:44347/api/resolutions",
    ajaxConfig: {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "localhost:5500/index.html"
        },
    },
    layout: "fitColumns",
    height: "795px",
    addRowPos: "bottom",
    pagination: "local",
    paginationSize: 2500,
    //paginationSizeSelector: [5, 10, 25, 100],
    tooltips: true,
    selectable: 1,
    columns: [{
            title: "Reso Number",
            field: "ResoNum",
            sorter: "number",
            hozAlign: "center"
        }, 
        {
            title: "Supercedes Reso Number",
            field: "SupercedesResoNum",
            sorter: "string",
            hozAlign: "center"
        },
        {
            title: "Description",
            field: "Description",
            sorter: "string",
            hozAlign: "left",
            width: 500
        }, 
        {
            title: "General Category",
            field: "GeneralCategory",
            sorter: "date",
            hozAlign: "center",
            width: 200
        },
        {
            title: "Date",
            field: "Date",
            sorter: "date",
            hozAlign: "center",
            formatter: "datetime",
            formatterParams: {
              inputFormat: "YYYY-MM-DD",
              outputFormat: "MM/DD/YYYY",
              invalidPlaceholder: "(Invalid Date)"
            }
        },
        {
            title: "Superceded By Reso Number",
            field: "SupercededByResoNum",
            sorter: "string",
            hozAlign: "center"
        }
    ]
});

//function for POSTING(adding) a resolution to the water.Reso.MasterList table

function addHandleSubmit(event){
  event.preventDefault();

  const data = new FormData(event.target);
  const value = Object.fromEntries(data.entries());

  fetch('https://localhost:44347/api/resolutions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  })
  .then(response => response.json())
  .then(value => {
    console.log('Success');
  })
  .catch((error) => {
    console.log('Error: ', error)
  });

  document.getElementById("resoNumAdd").value="";
  document.getElementById("supercedesResoNumAdd").value="";
  document.getElementById("descriptionAdd").value="";
  document.getElementById("generalCategoryAdd").value="";
  document.getElementById("dateAdd").value="";
  document.getElementById("supercededByResoNumAdd").value="";

  table.replaceData();
  table.redraw(true);
}

//Adding the event handler to the submit button in the "Add Resolution" modal
const addForm = document.getElementById("addForm");
addForm.addEventListener('submit', addHandleSubmit);

//function to DELETE a resolution from the water.Reso.MasterList table
function removeHandleSubmit(event){
  event.preventDefault();

  const data = new FormData(event.target);
  const value = Object.fromEntries(data.entries());
  const id = document.getElementById("resoNumRemove").value;

  fetch('https://localhost:44347/api/Resolutions/' + id, {
    method: 'DELETE',
  })
  .then(res => res.text())
  .then(value => {
    console.log('Success')
  })
  .catch((error) => {
    console.log('Error: ', error)
  });

  document.getElementById("resoNumRemove").value="";

  table.replaceData();
  table.redraw(true);
}

//Add event handler to the submit button in the "Remove Resolution" modal
const removeForm = document.getElementById("removeForm");
removeForm.addEventListener('submit', removeHandleSubmit);

//function for PUTTING(editing) a resolution to the water.Reso.MasterList table

function editHandleSubmit(event){
  event.preventDefault();

  const data = new FormData(event.target);
  const value = Object.fromEntries(data.entries());
  const id = document.getElementById("resoNumEdit").value;

  fetch('https://localhost:44347/api/resolutions/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  })
  .then(response => response.json())
  .then(value => {
    console.log('Success');
  })
  .catch((error) => {
    console.log('Error: ', error)
  });

  document.getElementById("resoNumEdit").value="";
  document.getElementById("supercedesResoNumEdit").value="";
  document.getElementById("descriptionEdit").value="";
  document.getElementById("generalCategoryEdit").value="";
  document.getElementById("dateEdit").value="";
  document.getElementById("supercededByResoNumEdit").value="";

  table.replaceData();
  table.redraw(true);
}

//Adding the event handler to the submit button in the "Add Resolution" modal
const editForm = document.getElementById("editForm");
editForm.addEventListener('submit', editHandleSubmit);

//Fills in Edit Resolution modal with selected resolution's data
function editData(){
  let rowData = table.getSelectedData();
  let rowJson = rowData[0];

  let rowResoNum = rowJson.ResoNum;
  let rowsupercedesResoNum = rowJson.SupercedesResoNum;
  let rowDescription = rowJson.Description;
  let rowGeneralCategory = rowJson.GeneralCategory;
  let rowDate = rowJson.Date;
  let dateObject = moment(rowDate);
  let dateFormatted = dateObject.format("YYYY-MM-DD");
  let rowSupercededByResoNum = rowJson.SupercededByResoNum;

  document.getElementById("resoNumEdit").value = rowResoNum;
  document.getElementById("supercedesResoNumEdit").value = rowsupercedesResoNum;
  document.getElementById("descriptionEdit").value = rowDescription;
  document.getElementById("generalCategoryEdit").value = rowGeneralCategory;
  document.getElementById("dateEdit").value = dateFormatted;
  document.getElementById("supercededByResoNumEdit").value = rowSupercededByResoNum;
};

//Fills in Remove Resolution modal with resolution number from selected resolution
function removeData(){
  let rowData = table.getSelectedData();
  let rowJson = rowData[0];

  let rowResoNum = rowJson.ResoNum;

  document.getElementById("resoNumRemove").value = rowResoNum;
};
