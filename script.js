jQuery.noConflict();
(function( $ ) {
    $(function() {
        $(document).ready(function() {

            // removes and adds placeholder onfocus/ blur
            $('input,textarea').focus(function(){
                $(this).data('placeholder',$(this).attr('placeholder'))
                      .attr('placeholder','');
                if($("#searchbox").val().length === 0) {
                    $("#search-icon").toggle();
                }
            }).blur(function(){
                $(this).attr('placeholder',$(this).data('placeholder'));
                if($("#searchbox").val().length === 0) {
                    $("#search-icon").toggle();
                }
            });
            $('#searchbox').focus();

            // Ajax call on Wikipedia API
            var searchInput;
            var searchLink;
            var searchWiki = function() {
                searchInput = $("#searchbox").val();
                searchLink = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&continue=-%7C%7C&utf8=1&srsearch="
                    + encodeURIComponent(searchInput) + "&sroffset=10";
                $("#searchresults article").remove();
                $("#searchresults-amount").html("");
                $("#searchresults header, #loadMoreResults").hide();
                function getSearchResults() {
                    $.ajax({
                        url: searchLink,
                        data: 'PlainObject',
                        dataType: 'jsonp',
                        type: 'POST',
                        success: function(response) {
                            if(response.error === undefined) {
                                var result = response.query.search;
                                if(result.length === 0) {
                                    $("#searchresults").append(
                                        "<article><p>Sorry, we couldn't find a match for " + "<b>\""
                                        + searchInput + "\"</b>. Please specify your search query.</p></article>"
                                    );
                                } else {
                                    $(result).each(function(key, value) {
                                        $("#loadMoreResults").before("<article></article>");
                                        $("#searchresults article:last-of-type").append(
                                            "<header><h3>" + result[key].title +
                                            "</h3></header><p><em>" +
                                            result[key].snippet + "[...]</em></p>"
                                        );
                                        $("#searchresults article:last-of-type").wrapInner(
                                            "<a href='https://en.wikipedia.org/wiki/"
                                            + encodeURIComponent(result[key].title)
                                            + "' target='_blank'></a>"
                                        );
                                    });
                                    $("#searchresults-amount").html(" (" + $('#searchresults article').length + " matches)");
                                    $("#searchresults header, #loadMoreResults").show();
                                }
                            }
                        }
                    });
                } getSearchResults();

                // load 10 more results on click
                var moreResults = 10;
                $("#loadMoreResults").on("click", function() {
                    moreResults += 10;
                    searchLink = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&continue=-%7C%7C&utf8=1&srsearch="
                        + encodeURIComponent(searchInput) + "&sroffset=" + moreResults;
                    getSearchResults();
                });
            }

            // exectues Ajax call on Wikipedia API on click
            $("#search-btn").on("click", searchWiki);

            // exectues Ajax call on Wikipedia API on "Enter"
            $('#searchbox').on('keypress', function (e) {
                if(e.which === 13){
                    searchWiki();
                    e.preventDefault();
                }
            });

            // deletes search input
            $("#remove-icon").on("click", function() {
                searchInput = $("#searchbox").val("");
                $("#search-icon").toggle();
            });

        });
    });
})(jQuery);
