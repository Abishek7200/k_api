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

      // Add search functionality to all table columns
      table.columns().every(function() {
        var column = this;
        var header = $(column.header());

        $('<input type="text" class="column-search" placeholder="Search...">')
          .appendTo(header)
          .on('keyup change', function() {
            var searchValue = this.value;

            // Split the search value by " | " to get multiple article IDs
            var searchArray = searchValue.split(' | ');

            // Apply the search for each article ID individually
            column
              .search(searchArray.join('|'), true, false, '|')
              .draw();
          });
      });

      // Column Toggle Event
      $('.column-toggle-checkbox').on('change', function() {
        var columnIndex = $(this).data('column-index');
        var column = table.column(columnIndex);
        column.visible($(this).is(':checked'));
      });

      // Toggle Columns Dropdown
      $('.column-toggle-button').on('click', function() {
        $(this).siblings('.column-toggle-dropdown-content').toggle();
      });
    });
});
