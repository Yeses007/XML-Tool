let input = document.querySelector("input");

// This event listener has been implemented to identify a
// Change in the input section of the html code
// It will be triggered when a file is chosen.
input.addEventListener("change", () => {
  let files = input.files;

  if (files.length == 0) return;

  // If any further modifications have to be made on the
  //   Extracted text. The text can be accessed using the
  // file variable. But since this is const, it is a read
  //only variable, hence immutable. To make any changes,
  //changing const to var, here and In the reader.onload
  //function would be advisible
  var strXML = files[0];

  let reader = new FileReader();

  reader.onload = (e) => {
    strXML = e.target.result;

    // This is a regular expression to identify carriage
    // Returns and line breaks
    // const lines = file.split(/\r\n|\n/);
    //textarea.value = lines.join("\n");

    /************************************************************************************* 
var doc;
if (window.ActiveXObject) {
  doc = new ActiveXObject("Microsoft.XMLDOM"); // For IE6, IE5
  doc.async = "false";
  doc.loadXML(strXML);
} else {
  var parser = new DOMParser();
  doc = parser.parseFromString(strXML, "text/xml"); // For Firefox, Chrome etc
}

*/
    var doc;
    var parser = new DOMParser();
    doc = parser.parseFromString(strXML, "text/xml");
    /**************************************************************************
     * Variable Declaration ******************************************************
     ****************************************************************************/
    var output = document.getElementById("textarea");
    var fileNameOutput = document.getElementById("dload-fn");
    var extractedData = [];
    var authorExtractedData = [];
    var otherrefExtractedData = [];
    var otherrefAuthorExtractedData = [];
    var finalData = [];

    /*
    var journalTitle;
    var volume;
    var year;
    var author;
    var firstPage;
    /*
    /**************************************************************************
     * Reusable Functions ******************************************************
     ****************************************************************************/
    /*   getValue function is used to get value of perticular Tag */
    const getValue = function (tag) {
      try {
        return doc.getElementsByTagName(`${tag}`)[0].childNodes[0].nodeValue;
      } catch {
        return " ";
      }
    };
    /************************************************ */

    /************************************************************************************** */
    /*****************************Take other Basic Information by using getValue Function **************************/
    /************************************************************************************** */

    var doi_batch_id = getValue("journal-id");
    var depositorName;
    var email_address;
    var registrant =
      getValue("publisher-name") + ", " + getValue("publisher-loc");
    var full_title;
    var abbrev_title;
    var resource;
    var first_page = getValue("fpage");

    var last_page = getValue("lpage");

    /************************************************************************************** */
    /*****************************Printing modified and extracted Data **************************/
    /************************************************************************************** */

    output.value += `
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
<journal_metadata language=" ">
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
<title> </title>
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
<doi> </doi>
<resource> </resource>
</doi_data>
<citation_list>
`;

    /*************************************************************************** */
    /**********  CITATION FUNCTION TO GET CITATION BLOCK DATA FROM FILE */
    /********************************************************************************* */

    var citation = function (mainTag) {
      //var x = doc.querySelectorAll("jnref");
      //   var x = doc.getElementsByTagName("jnref");
      var x = doc.getElementsByTagName(`${mainTag}`);

      var y = doc.getElementsByTagName("otherref");
      var z = x + y;
      console.log();

      for (i = 0; i < x.length; i++) {
        var obj = {
          refId: "",
          journalTitle: "",
          author: "",
          volume: "",
          firstPage: "",
          year: "",
          uri: "",
        };

        //Will get refID Numbering from data
        try {
          obj.refId = x[i].getAttribute("numbering");
        } catch {}

        //Will get Journal-title from data
        try {
          obj.journalTitle = x[i].getElementsByTagName(
            "journal-title"
          )[0].childNodes[0].nodeValue;
        } catch {}

        //Will get author from Data
        /* try {
          obj.author =
            x[i].getElementsByTagName("surname")[0].childNodes[0].nodeValue +
            " " +
            x[i].getElementsByTagName("given-names")[0].childNodes[0]
              .nodeValue +
            ",";
        } catch {}
*/

        // will get volume from data
        try {
          obj.volume = x[i].getElementsByTagName(
            "volume"
          )[0].childNodes[0].nodeValue;
        } catch {}

        // Will get year from data
        try {
          obj.year = x[i].getElementsByTagName(
            "year"
          )[0].childNodes[0].nodeValue;
        } catch {}

        // will get firstPage From Data
        try {
          obj.firstPage = x[i].getElementsByTagName(
            "fpage"
          )[0].childNodes[0].nodeValue;
        } catch {}

        extractedData.push(obj);
      }

      /**************************************************************************************************
       * ********************** Code to extract all authors Data****************************
       **************************************************************************************/
      let jnref = doc.querySelectorAll(`${mainTag}`);
      jnref.forEach((element) => {
        var x = element.querySelectorAll("name");
        var auth = {
          author: "",
        };
        try {
          auth.author += element.getElementsByTagName(
            "collab-name"
          )[0].childNodes[0].nodeValue;
        } catch {}
        x.forEach((ele) => {
          try {
            auth.author +=
              ele.getElementsByTagName("given-names")[0].childNodes[0]
                .nodeValue +
              " " +
              ele.getElementsByTagName("surname")[0].childNodes[0].nodeValue +
              ", ";
          } catch {}
        });
        authorExtractedData.push(auth);
      });

      /**************************************************************************************************
       * ************************************************************************************************
       **************************************************************************************/

      // Below code Prints all extracted citation Block

      /*   for (let num = 0; num < extractedData.length; num++) {
        output.value += `
<citation key="ref${extractedData[num].refId}">
<journal_title>${extractedData[num].journalTitle}</journal_title>
<author>${authorExtractedData[num].author}</author>
<volume>${extractedData[num].volume}</volume>
<first_page>${extractedData[num].firstPage}</first_page>
<cYear>${extractedData[num].year}</cYear>
</citation>;
`;
      } */
    };
    /************************************************************************************************************************************************Function Call************************************************ */
    citation("jnref");

    /***************************************************************************************************************************************************Function to get details of "otherref" tags************************************
     * *************************************************************************************************/
    var otherrefCitation = function (otherMainTag) {
      //var x = doc.querySelectorAll("jnref");
      var y = doc.getElementsByTagName(`${otherMainTag}`);

      console.log();

      for (i = 0; i < y.length; i++) {
        var obj = {
          refId: "",
          journalTitle: "",
          author: "",
          volume: "",
          firstPage: "",
          year: "",
          uri: "",
        };

        //Will get refID Numbering from data
        try {
          obj.refId = y[i].getAttribute("numbering");
        } catch {}

        //Will get Journal-title from data
        try {
          obj.journalTitle = y[i].getElementsByTagName(
            "subtitle"
          )[0].childNodes[0].nodeValue;
        } catch {}

        //Will get author from Data
        /* try {
            obj.author =
              x[i].getElementsByTagName("surname")[0].childNodes[0].nodeValue +
              " " +
              x[i].getElementsByTagName("given-names")[0].childNodes[0]
                .nodeValue +
              ",";
          } catch {}
  */

        // will get volume from data
        try {
          obj.volume = y[i].getElementsByTagName(
            "volume"
          )[0].childNodes[0].nodeValue;
        } catch {}

        // Will get year from data
        try {
          obj.year = y[i].getElementsByTagName(
            "year"
          )[0].childNodes[0].nodeValue;
        } catch {}

        // will get firstPage From Data
        try {
          obj.firstPage = y[i].getElementsByTagName(
            "fpage"
          )[0].childNodes[0].nodeValue;
        } catch {}

        try {
          obj.uri = y[i].getElementsByTagName("uri")[0].childNodes[0].nodeValue;
        } catch {}

        extractedData.push(obj);
      }

      /**************************************************************************************************
       * ********************** Code to extract all authors Data****************************
       **************************************************************************************/
      let otherref = doc.querySelectorAll(`${otherMainTag}`);
      otherref.forEach((element) => {
        var x = element.querySelectorAll("name");
        var auth = {
          author: "",
        };
        x.forEach((ele) => {
          try {
            auth.author +=
              ele.getElementsByTagName("given-names")[0].childNodes[0]
                .nodeValue +
              " " +
              ele.getElementsByTagName("surname")[0].childNodes[0].nodeValue +
              ", ";
          } catch {}
        });
        authorExtractedData.push(auth);
      });

      /**************************************************************************************************
       * ************************************************************************************************
       **************************************************************************************/

      // Below code Prints all extracted citation Block

      /* for (let num = 0; num < otherrefExtractedData.length; num++) {
        output.value += `
  <citation key="ref${otherrefExtractedData[num].refId}">
  <journal_title>${otherrefExtractedData[num].journalTitle}</journal_title>
  <author>${otherrefAuthorExtractedData[num].author}</author>
  <volume>${otherrefExtractedData[num].volume}</volume>
  <first_page>${otherrefExtractedData[num].firstPage}</first_page>
  <cYear>${otherrefExtractedData[num].year}</cYear>
  </citation>;
  `;
      } */
    };

    /************************************************************************************************************************************************Function Call************************************************ */

    otherrefCitation("otherref");

    /***********************************************************************
     * ******************************************************************************************************
     * ********** Below Code will add authors to ExtractedData List *************************
     *************************************************************************************/

    for (let i = 0; i < extractedData.length; i++) {
      extractedData[i].author = authorExtractedData[i].author;
    }
    /*********************************************************************************** *
     * /
     

     /*******************************************************************************************************************************************************************************************************************************************************Below code will sort the Extracted Data List Based on RefId or Numbering 
      * ******************************************************************************
     */

    function sortByrefId(a, b) {
      if (Number(a.refId) < Number(b.refId)) {
        return -1;
      }
      if (Number(a.refId) > Number(b.refId)) {
        return 1;
      }
      return 0;
    }

    extractedData.sort(sortByrefId);

    /****************************************************************************************************
     * *******************************************************************************************
     */

    /**********************************************************************************************************************************Below Code will Print all citation and otherref citations in an order********************************************************************************************** */

    for (let num = 0; num < extractedData.length; num++) {
      output.value += `
<citation key="ref${extractedData[num].refId}">
${
  extractedData[num].uri.length > 0
    ? `<unstructured_citation>${extractedData[num].uri},${extractedData[num].author}</unstructured_citation>
`
    : ``
}${
        extractedData[num].journalTitle.length > 0
          ? `<journal_title>${extractedData[num].journalTitle}</journal_title>
    `
          : ``
      }${
        extractedData[num].author.length > 0
          ? `<author>${extractedData[num].author}</author>
    `
          : ``
      }${
        extractedData[num].volume.length > 0
          ? `<volume>${extractedData[num].volume}</volume>
    `
          : ``
      }${
        extractedData[num].firstPage.length > 0
          ? `<first_page>${extractedData[num].firstPage}</first_page>
    `
          : ``
      }${
        extractedData[num].year.length > 0
          ? `<cYear>${extractedData[num].year}</cYear>`
          : ``
      }
</citation>;
`;
    }

    console.log(extractedData);
    output.value += `
   
</citation_list>
</journal>
</body>
</doi_batch>
`;

    /************************************************************************************
     * ************** Below code adds doi-batch-id as filename to output*****************
     */
    var fileNameOutput = document.getElementById("dload-fn");

    fileNameOutput.value = `${doi_batch_id}.xml`;
    /****************************************************************/
    /************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************** */
  };

  reader.onerror = (e) => alert(e.target.error.name);

  reader.readAsText(strXML);
});

/********************************************************************************************
 ****************************************************************************************************************
 ****************Below code performs download of extracted text *******************************/
document.getElementById("dload").onclick = function () {
  var l = document.createElement("a");
  l.href =
    "data:text/plain;charset=UTF-8," +
    document.getElementById("textarea").value;
  l.setAttribute("download", document.getElementById("dload-fn").value);
  l.click();
};
