function parse_blogger_date(date_str) {
	var months = {
		'01':'January',
		'02':'February',
		'03':'March',
		'04':'April',
		'05':'May',
		'06':'June',
		'07':'July',
		'08':'August',
		'09':'September',
		'10':'October',
		'11':'November',
		'12':'December'
	};
	var year = date_str.substring(0,4);
	var month = date_str.substring(5,7);
	var day = date_str.substring(8,10);
	
	return months[month] + " " + day + ", " + year;
}