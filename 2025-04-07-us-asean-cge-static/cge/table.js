
    $(document).ready(function() {
        $('#data-table').DataTable({
            responsive: true,
            pageLength: 25,
            lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            order: [[1, 'desc']],  // Sort by the second column (Value) by default
            scrollX: true,
            autoWidth: true,
            dom: '<"top"lf>rt<"bottom"ip><"clear">'
        });
    });
    