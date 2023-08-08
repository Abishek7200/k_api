document.addEventListener("DOMContentLoaded", () => {
  fetch("../data.json")
    .then((response) => response.json())
    .then((data) => {
      const table = $("#jsonDataTable").DataTable({
        data: data.hits,
        columns: [
          { data: "_id", orderable: false },
          { data: "_source.articleType", orderable: false },
          { data: "_source.receivedDate", defaultContent: "", orderable: false },
          { data: "_source.article-version" , orderable: false },
          { data: "_source.stageName", orderable: false },
          {
            data: null,
            render: function (data, type, row) {
              const stages = data._source.stage;
              const stageNames = stages.map((stage) => stage.name).join(", ");
              return stageNames;
            },
            orderable: false,
          },
          {
            data: null,
            render: function (data, type, row) {
              const submissionDecision = data._source["submission-decision"];
              if (submissionDecision && submissionDecision.length > 0) {
                const lastDecision =
                  submissionDecision[submissionDecision.length - 1];
                return lastDecision.decision;
              }
              return "";
            },
            orderable: false,
          },
          {
            data: null,
            render: function (data, type, row) {
              const submissionDecision = data._source["submission-decision"];
              if (submissionDecision && submissionDecision.length > 0) {
                const lastDecision =
                  submissionDecision[submissionDecision.length - 1];
                return lastDecision.date;
              }
              return "";
            },
            orderable: false,
          },
          {
            data: "_source.keywords",
            render: function (data) {
              if (data && data.length > 0) {
                return data.join(", ");
              }
              return "";
            },
            orderable: false,
          },
          {
            data: "_source.subject-areas",
            render: function (data) {
              if (data && data.length > 0) {
                return data.join(", ");
              }
              return "";
            },
            orderable: false,
          },
          { data: "_source.special-issue", orderable: false },
          { data: "_source.review-status", defaultContent: "", orderable: false },
          {
            data: null,
            render: function (data, type, row) {
              const stages = data._source.stage;
              const hasAuthorResubmission = stages.some(
                (stage) => stage.name === "Author resubmission"
              );
              return hasAuthorResubmission ? "Yes" : "";
            },
            orderable: false,
          },
          {
            data: null,
            render: function(data, type, row) {
              const stages = data._source.stage;
              const authorResubmissionStage = stages.find(stage => stage.name === "Author resubmission");
              if (authorResubmissionStage) {
                const startDate = authorResubmissionStage["start-date"];
                return startDate;
              } else {
                return "";
              }
            },
            orderable: false
          },
          {
            data: null,
            render: function(data, type, row) {
              const stages = data._source.stage;
              const authorResubmissionStage = stages.find(stage => stage.name === "Author resubmission");
              if (authorResubmissionStage) {
                const endDate = authorResubmissionStage["end-date"];
                return endDate;
              } else {
                return "";
              }
            },
            orderable: false
          },
          {
            data: null,
            render: function(data, type, row) {
              const stages = data._source.stage;
              const authorResubmissionStage = stages.find(stage => stage.name === "Author resubmission");
              if (authorResubmissionStage) {
                const startDate = new Date(authorResubmissionStage["start-date"]);
                const endDate = new Date(authorResubmissionStage["end-date"]);
                const timeDiff = endDate.getTime() - startDate.getTime();
                
                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          
                let duration = "";
                if (days > 0) {
                  duration += days + " days ";
                }
                if (hours > 0) {
                  duration += hours + " hours ";
                }
                if (minutes > 0) {
                  duration += minutes + " minutes ";
                }
                if (seconds > 0) {
                  duration += seconds + " seconds";
                }
          
                return duration;
              }
              return "";
            },
            orderable: false,
          },                           
        ],
        columnDefs: [
          { targets: [1, 2, 3], render: $.fn.dataTable.render.text() },
          { targets: [4], width: "80%" },
          // Adjust other column widths as needed
        ],
        ordering: false,
        pageLength: 100,
        search: {
          smart: false,
          regex: true,
        }

      });

      // Add event listener to export Excel button
      document.getElementById("exportExcelButton").addEventListener("click", () => {
        const dataTable = table.table().node();
        const ws = XLSX.utils.table_to_sheet(dataTable);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DataTable");
        XLSX.writeFile(wb, "table_data.xlsx");
      });

      // Update customer information
      const hitsCount = data.hits.length; // Update hits count based on the data
      const customerInfo = document.getElementById("customerInfo");
      customerInfo.innerHTML = `Customer: Lithosphere (${hitsCount})`;

    // Add search functionality to all table columns
    table.columns().every(function () {
      var column = this;
      var header = $(column.header());

      $('<input type="text" class="column-search" placeholder="Search...">')
        .appendTo(header)
        .on("keyup change", function () {
          var searchValue = this.value;

          // Split the search value by " | " to get multiple article IDs
          var searchArray = searchValue.split(" | ");

          // Apply the search for each article ID individually
          column
            .search(searchArray.join("|"), true, false, "|")
            .draw();
        });
    });    

    const dataTable = $("#jsonDataTable").DataTable();

    // Add event listener to hide columns
  $("thead th").each(function (index) {
    const $th = $(this);
    $th.append('<span class="column-hide-icon" data-column-index="' + index + '">&times;</span>');
  });

  $(document).on("click", ".column-hide-icon", function () {
    const columnIndex = $(this).data("column-index");
    dataTable.column(columnIndex).visible(false);
  });

  // Add event listener to scroll-to-top icon
  const scrollToTopButton = document.querySelector(".scroll-to-top");
  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

    })
    .catch((error) => {
      console.log("Error fetching data:", error);
    });
});
