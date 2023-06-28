$(document).ready(function() {
  // Fetch data and initialize DataTable
  fetch('../data.json')
    .then(response => response.json())
    .then(data => {
      const hits = data.hits;
      const stages = [];

      const calculateTimeDifference = (startDatedata, endDatedate) => {
        const diffInMilliseconds = Math.abs(endDatedate - startDatedata);
        const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
        
        const days = Math.floor(diffInSeconds / (24 * 60 * 60));
        const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
        const seconds = Math.floor(diffInSeconds % 60);
        
        return {
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds
        };
      };
      

      hits.forEach(hit => {
        const articleId = hit._id;
        const articleStages = hit._source.stage;

        articleStages.forEach(stage => {
          const startDate = stage['start-date'];
          const endDate = stage['end-date'];
          const startDatedata = new Date(startDate);
          const endDatedate = new Date(endDate);
          const daysInProd = stage['days-in-production'];

          const stageDuration = calculateTimeDifference(startDatedata, endDatedate);

          stages.push({
            id: articleId,
            name: stage.name,
            startDate: startDate,
            endDate: endDate,
            stageDuration: stageDuration,
            daysInProd: daysInProd
          });
        });
      });

      const table = $('#jsonDataTable').DataTable({
        data: stages,
        columns: [
          { 
            title: 'Article ID',
            data: 'id',
            defaultContent: '',
            orderable: false,
            render: function(data, type, row) {
              return data + '<span class="copy-icon article-id-icon" title="Copy all Article IDs">&#128203;</span>';
            }
          },
          { title: 'Stage Name', data: 'name', defaultContent: '', orderable: false },
          { title: 'Start Date', data: 'startDate', defaultContent: '', orderable: false },
          { title: 'End Date', data: 'endDate', defaultContent: '', orderable: false },
          // { title: 'Stage Duration', data: 'stageDuration', defaultContent: '', orderable: false },
          { 
            title: 'Stage Duration',
            data: 'stageDuration',
            defaultContent: '',
            orderable: false,
            render: function(data, type, row) {
              if (type === 'display') {
                const days = data.days;
                const hours = data.hours;
                const minutes = data.minutes;
                const seconds = data.seconds;
                return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
              }
              return '';
            }
          },
          { title: 'Days in Production', data: 'daysInProd', defaultContent: '', orderable: false }
        ],
        ordering: false,
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
      $('#jsonDataTable th').eq(5).css('width', '20%'); // Set width for the sixth column

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

      // Copy Article ID
      $('.copy-icon.article-id-icon').on('click', function() {
        var articleIDs = [];
        table.rows({ search: 'applied' }).every(function() {
          var data = this.data();
          articleIDs.push(data.id);
        });

        var textToCopy = articleIDs.join('\n');
        copyToClipboard(textToCopy);
        alert('Article IDs copied to clipboard: \n' + textToCopy);
      });

      // Copy to Clipboard function
      function copyToClipboard(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    });
});
