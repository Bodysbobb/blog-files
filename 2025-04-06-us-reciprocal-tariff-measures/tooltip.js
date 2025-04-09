
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        var map = document.querySelector('.leaflet-map-pane').__leaflet_map__;
        if (map) {
            map.setMinZoom(2);
            var worldBounds = [[-90, -180], [90, 180]];
            map.setMaxBounds(worldBounds);
        }

        document.addEventListener('DOMNodeInserted', function(e) {
            if (e.target.classList && e.target.classList.contains('leaflet-tooltip')) {
                const tooltipContent = e.target.innerHTML;
                const lines = tooltipContent.split('<br>');

                if (lines.length === 0) return;

                // Process each line individually
                let formattedLines = [];
                let noteLineIndex = -1;
                
                lines.forEach((line, i) => {
                    // Always include the first line (title/header)
                    if (i === 0) {
                        formattedLines.push(`<b>${line.trim()}</b>`);
                        return;
                    }

                    const parts = line.split(':');
                    if (parts.length < 2) {
                        formattedLines.push(line);
                        return;
                    }

                    const label = parts[0].trim();
                    let value = parts.slice(1).join(':').trim();
                    const lower = label.toLowerCase();
                    
                    // Check if this is a note field (case insensitive)
                    if (lower === 'note') {
                        // Only include notes that have actual content
                        if (value && value !== 'nan' && value !== 'NaN' && value !== 'null' && value !== 'undefined' && value !== '') {
                            // Store for later to add at the end
                            noteLineIndex = i;
                            // Style note with smaller font and italics
                            formattedLines.push(`<span style="font-size: 0.9em; font-style: italic;"><br>${label}: ${value}</span>`);
                        }
                        // Skip adding this line for now
                        return;
                    }
                    
                    // Handle numeric values
                    const num = parseFloat(value.replace(/[^\d.-]/g, ''));
                    if (!isNaN(num)) {
                        // Format according to field type
                        if (lower.includes('%') || lower.includes('percent') || lower.includes('rate') || 
                           lower.includes('tariff') || lower.includes('import') || lower.includes('export')) {
                            value = `${num.toFixed(2)}%`;
                        } else if (lower.includes('total trade') || lower.includes('balance')) {
                            value = `$${num.toFixed(2)}B`;
                        } else {
                            value = `${num.toLocaleString()}`;
                        }
                    } 
                    // Handle empty or NA/NaN values
                    else if (!value || value === 'nan' || value === 'NaN' || value === 'null' || value === 'undefined') {
                        value = '-';
                    }
                    
                    // Add the formatted line
                    formattedLines.push(`${label}: ${value}`);
                });
                
                // Set the updated content back
                e.target.innerHTML = formattedLines.join('<br>');
            }
        });

        document.querySelector('.leaflet-container').addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('leaflet-interactive')) {
                e.stopPropagation();
            }
        }, true);
    }, 1000);
});
