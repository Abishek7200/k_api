document.addEventListener("DOMContentLoaded", () => {
  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      const extractedData = data.map((item) => {
        const {
          doi,
          name,
          message,
          status,
          version,
          "assigned-start-date": assignedStartDate,
          "assigned-end-date": assignedEndDate,
          "actual-start-date": actualStartDate,
          "actual-end-date": actualEndDate,
          "completed-date": completedDate,
        } = item;

        const formatDate = (date) => {
          if (!date) return ""; // Return empty string if the date is not available
          const d = new Date(date);
          const formattedDate = d.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          return formattedDate;
        };

        return [
          doi,
          name,
          message,
          status,
          version,
          formatDate(assignedStartDate),
          formatDate(assignedEndDate),
          formatDate(actualStartDate),
          formatDate(actualEndDate),
          formatDate(completedDate),
        ];
      });

      const table = $("#jsonDataTable").DataTable({
        data: extractedData,
        columns: [
          { data: 0, defaultContent: "", orderable: false, width: "20%" },
          { data: 1, defaultContent: "", orderable: false },
          { data: 2, defaultContent: "", orderable: false },
          { data: 3, defaultContent: "", orderable: false },
          { data: 4, defaultContent: "", orderable: false },
          { data: 5, defaultContent: "", orderable: false },
          { data: 6, defaultContent: "", orderable: false },
          { data: 7, defaultContent: "", orderable: false },
          { data: 8, defaultContent: "", orderable: false },
          { data: 9, defaultContent: "", orderable: false },
        ],
        ordering: false,
        pageLength: 100,
        search: {
          smart: false,
          regex: true,
        },
      });

      // Adjust column widths
      $("#jsonDataTable").css("width", "100%");
      $("#jsonDataTable th").eq(0).css("width", "20%");
      $("#jsonDataTable th").eq(1).css("width", "30%");
      $("#jsonDataTable th").eq(2).css("width", "30%");
      $("#jsonDataTable th").eq(5).css("width", "10%");

      // Update customer information
      const hitsCount = extractedData.length;
      const customerInfo = document.getElementById("customerInfo");
      customerInfo.innerHTML = `Customer: Medwave (${hitsCount})`;

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

      // Column Toggle Event
      $(".column-toggle-checkbox").on("change", function () {
        var columnIndex = $(this).data("column-index");
        var column = table.column(columnIndex);
        column.visible($(this).is(":checked"));
      });

      // Toggle Columns Dropdown
      $(".column-toggle-button").on("click", function () {
        $(this).siblings(".column-toggle-dropdown-content").toggle();
      });

      // Add click event listener to the copy icon
      document.querySelector(".copy-icon").addEventListener("click", () => {
        const articleIds = Array.from(
          document.querySelectorAll("#jsonDataTable tbody tr td:first-child")
        )
          .map((td) => td.textContent)
          .join("\n");

        copyToClipboard(articleIds);
        alert("Article IDs copied!");
      });
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
    });
});

// Function to copy text to clipboard
function copyToClipboard(text) {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}
