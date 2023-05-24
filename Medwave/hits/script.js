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
        ],
        ordering: false,
        pageLength: 100,
        search: {
          smart: false,
          regex: true,
        },
      });

      // Adjust column widths
      $("#jsonDataTable").css("width", "100%"); // Set table width to 100%
      $("#jsonDataTable th").eq(0).css("width", "20%"); // Set width for the first column
      $("#jsonDataTable th").eq(1).css("width", "30%"); // Set width for the second column
      $("#jsonDataTable th").eq(2).css("width", "30%"); // Set width for the third column
      $("#jsonDataTable th").eq(5).css("width","10%"); // Set width for the third column

      // Update customer information
      const hitsCount = data.hits.length; // Update hits count based on the data
      const customerInfo = document.getElementById("customerInfo");
      customerInfo.innerHTML = `Customer: Medwave (${hitsCount})`;

      // Apply search functionality to all table columns
      $("#jsonDataTable thead input").each(function () {
        $(this).on("keyup", function () {
          table
            .column($(this).parent().index() + ":visible")
            .search(this.value)
            .draw();
        });
      });

      // Column Toggle Event
      $('.column-toggle-checkbox').on('change', function () {
        var columnIndex = $(this).data('column-index');
        var column = table.column(columnIndex);
        column.visible($(this).is(':checked'));
      });

      // Toggle Columns Dropdown
      $('.column-toggle-button').on('click', function () {
        $(this).siblings('.column-toggle-dropdown-content').toggle();
      });
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
    });
});

// Add click event listener to the copy icon
document.querySelector('.copy-icon').addEventListener('click', () => {
  const articleIds = Array.from(document.querySelectorAll('#jsonDataTable tbody tr td:first-child'))
    .map(td => td.textContent)
    .join('\n');

  copyToClipboard(articleIds);
  alert('Article IDs copied!');
});

// Function to copy text to clipboard
function copyToClipboard(text) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
