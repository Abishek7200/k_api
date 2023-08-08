$(document).ready(function() {
  var table = null;

  // Fetch data and initialize DataTable
  fetch('../data.json')
    .then(response => response.json())
    .then(data => {
      var hits = data.hits;
      var tableBody = $('#jsonDataTable tbody');

      for (var i = 0; i < hits.length; i++) {
        var hit = hits[i];
        var source = hit._source;
        var submissionDecisions = source['submission-decision'];
        var articleId = hit._id;

        if (submissionDecisions === null) {
          var row = $('<tr>');
          row.append($('<td>').text(articleId));
          row.append($('<td>').text(''));
          row.append($('<td>').text(''));
          row.append($('<td>').text(''));
          row.append($('<td>').text(''));

          tableBody.append(row);
        } else {
          for (var j = 0; j < submissionDecisions.length; j++) {
            var submissionDecision = submissionDecisions[j];
            var stageName = submissionDecision.stage;
            var startDecision = submissionDecision.decision;
            var decisionDate = submissionDecision.date;
            var stageVersion = submissionDecision.version;

            if (j === 0) {
              var row = $('<tr>');
              row.append($('<td>').text(articleId));
            } else {
              var row = $('<tr>');
              row.append($('<td>').text(articleId));
            }

            row.append($('<td>').text(stageName));
            row.append($('<td>').text(startDecision));
            row.append($('<td>').text(decisionDate));
            row.append($('<td>').text(stageVersion));

            tableBody.append(row);
          }
        }
      }

      // Initialize DataTable
      table = $('#jsonDataTable').DataTable({
        ordering: false, // Disable sorting
        pageLength: 100,
        search: {
          smart: false,
          regex: true
        }
      });

      // Adjust column widths
      $('#jsonDataTable').css('width', '100%'); // Set table width to 100%
      $('#jsonDataTable th').eq(0).css('width', '20%'); // Set width for the first column
      $('#jsonDataTable th').eq(1).css('width', '20%'); // Set width for the second column
      $('#jsonDataTable th').eq(2).css('width', '20%'); // Set width for the third column
      $('#jsonDataTable th').eq(3).css('width', '20%'); // Set width for the fourth column
      $('#jsonDataTable th').eq(4).css('width', '20%'); // Set width for the fifth column

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
  
    });
});
