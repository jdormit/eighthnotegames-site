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

function parse_blogger_date(date_str) {
	var year = date_str.substring(0,4);
	var month = date_str.substring(5,7);
	var day = date_str.substring(8,10);
	if (day.charAt(0) == '0')
		day = day.substr(1,day.length);
	
	return {'date_str': months[month] + " " + day + ", " + year, 'date': {"year": year, "month": month, "day": day}};
}

function parse_title_as_anchor(title) {
	title = title.toLowerCase();
	var anchor = title.replace(/ /g, "-");
	return anchor;
}