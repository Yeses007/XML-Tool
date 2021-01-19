var metaData = `
<doi_batch xmlns="http://www.crossref.org/schema/4.3.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="4.3.0" xsi:schemaLocation="http://www.crossref.org/schema/4.3.0 http://www.crossref.org/schema/deposit/crossref4.3.0.xsd">
<head>
<doi_batch_id>${doi_batch_id}</doi_batch_id>
<timestamp> </timestamp>
<depositor>
<name> </name>
<email_address> </email_address>
</depositor>
<registrant>${registrant}</registrant>
</head>
<body>
<journal>
<journal_metadata language="${language}">
<full_title> </full_title>
<abbrev_title> </abbrev_title>
<issn media_type="print"> </issn>
<issn media_type="electronic"> </issn>
<doi_data>
<doi> </doi>
<resource> </resource>
</doi_data>
</journal_metadata>
<journal_issue>
<publication_date media_type=" ">
<month> </month>
<day> </day>
<year> </year>
</publication_date>
<journal_volume>
<volume> </volume>
</journal_volume>
<issue> </issue>
</journal_issue>
<journal_article publication_type=" ">
<titles>
<title>${article_title}</title>
</titles>
<contributors>
<person_name contributor_role=" " sequence=" ">
<given_name> </given_name>
<surname> </surname>
</person_name>
</contributors>
<publication_date media_type=" ">
<month> </month>
<day> </day>
<year> </year>
</publication_date>
<pages>
<first_page>${first_page} </first_page>
<last_page>${last_page}</last_page>
</pages>
<doi_data>
<doi>${article_id}</doi>
<resource> </resource>
</doi_data>
<citation_list>
`;
