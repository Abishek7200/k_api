document.addEventListener("DOMContentLoaded", () => {
  fetch("../data.json")
    .then((response) => response.json())
    .then((data) => {
      const reviewers = Object.entries(data.reviewers); // Get the reviewer entries

      const articleIds = reviewers.flatMap(([reviewerId, reviewer]) =>
        reviewer.map((review) => [reviewerId, review]) // Include the reviewer ID with each review
      );

      const table = $("#jsonDataTable").DataTable({
        data: articleIds.map(([reviewerId, review]) => [
          reviewerId,
          `${review.name.surname}, ${review.name["given-names"]}`, // Format the reviewer name
          review.email,
          review.version,
          review.message, review["completed-date"]
        ]), // Format the data with reviewer ID, reviewer name, and message value
        columns: [
          { data: 0, defaultContent: "", orderable: false }, // Use data index 0 for the reviewer ID
          { data: 1, defaultContent: "", orderable: false }, // Use data index 1 for the reviewer name
          { data: 2, defaultContent: "", orderable: false }, // Use data index 1 for the reviewer email
          { data: 3, defaultContent: "", orderable: false }, // Use data index 1 for the version
          { data: 4, defaultContent: "", orderable: false }, // Use data index 2 for the message value
          { data: 5, defaultContent: "", orderable: false }, // Use data index 2 for the completed date
        ],
        columnDefs: [
          { targets: [0, 1, 2], render: $.fn.dataTable.render.text() },
          { targets: [2], width: "80%" },
          // Adjust other column widths as needed
        ],
        ordering: false,
        pageLength: 100,
        search: {
          smart: false,
          regex: true,
        },
      });

      // Apply search functionality to all table columns
      $("#jsonDataTable thead input").each(function () {
        $(this).on("keyup", function () {
          table
            .column($(this).parent().index() + ":visible")
            .search(this.value)
            .draw();
        });
      });

      // Update customer information
      const hitsCount = articleIds.length; // Update hits count based on the data
      const customerInfo = document.getElementById("customerInfo");
      customerInfo.innerHTML = `Customer: Medwave (${hitsCount})`;

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
