
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () {
            const mapPane = document.querySelector('.leaflet-map-pane');
            if (mapPane) {
                const map = mapPane.__leaflet_map__;
                if (map) {
                    map.setMinZoom(2);
                    const bounds = [[-90, -180], [90, 180]];
                    map.setMaxBounds(bounds);
                }
            }

            document.addEventListener('DOMNodeInserted', function (e) {
                if (e.target.classList && e.target.classList.contains('leaflet-tooltip')) {
                    const lines = e.target.innerHTML.split('<br>');
                    if (!lines.length) return;

                    let formattedLines = [];
                    let unitHint = '';
                    lines.forEach((line, i) => {
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
                        const lowerLabel = label.toLowerCase();

                        // Detect unit
                        if (lowerLabel === 'unit') {
                            unitHint = value.toLowerCase();
                            formattedLines.push(`${label}: ${value}`);
                            return;
                        }

                        // Format Note separately
                        if (lowerLabel === 'note') {
                            if (value && value !== 'nan' && value !== 'NaN' && value !== 'null') {
                                formattedLines.push(`<span style="font-size: 0.9em; font-style: italic;"><br>${label}: ${value}</span>`);
                            }
                            return;
                        }

                        const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
                        if (!isNaN(numericValue)) {
                            let formatted = numericValue.toFixed(2);
                            if (lowerLabel === 'value') {
                                if (unitHint.includes('percent')) {
                                    formatted += '%';
                                } else if (unitHint.includes('billion')) {
                                    formatted = `$${formatted}B`;
                                } else if (unitHint.includes('million')) {
                                    formatted = `$${formatted}M`;
                                }
                            }
                            value = formatted;
                        }

                        formattedLines.push(`${label}: ${value}`);
                    });

                    e.target.innerHTML = formattedLines.join('<br>');
                }
            });
        }, 1000);
    });
    