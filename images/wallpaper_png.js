/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAA/CAIAAADYPYeIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5QTRGQkZFRkU5QTJFMjExQjlDNUU1NzM2NzYyNzNCRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCREVGMkZBOUI4NTIxMUUyQjg5NzlEMjc0Qjc2QUIwRSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCREVGMkZBOEI4NTIxMUUyQjg5NzlEMjc0Qjc2QUIwRSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3QzRERUE5NzUyQjhFMjExQkFENEE3QTYxODUxQjE0RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QTRGQkZFRkU5QTJFMjExQjlDNUU1NzM2NzYyNzNCRCIvPiA8L3JkZjpEZXNjcmlwdGlv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';
export default img;
